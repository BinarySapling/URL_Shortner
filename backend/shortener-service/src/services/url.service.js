import { createHash } from 'crypto';
import Hashids from 'hashids';
import Url from '../models/Url.model.js';
import redis from '../config/redis.js';
import env from '../config/env.js';
import { checkUrlSafety } from './security.service.js';

let hashids;
const getHashids = () => {
  if (!hashids) {
    hashids = new Hashids(env.HASHID_SALT, env.HASHID_MIN_LENGTH);
  }
  return hashids;
};

const COUNTER_KEY  = 'url_shortener:counter';
const START_OFFSET = 100000;

const RESERVED_KEYWORDS = new Set([
  'admin', 'api', 'login', 'register', 'dashboard', 'metrics', 'analytics', 'settings'
]);

// Build a stable Redis key from any URL string
const idempotencyKey = (url) =>
  `idem:${createHash('sha256').update(url).digest('hex').slice(0, 16)}`;

export const shortenUrl = async (originalUrl, ttlDays = env.DEFAULT_TTL_DAYS, alias = null) => {
  // Clamp the requested TTL to a maximum of 90 days to enforce DB storage limits
  ttlDays = Math.min(ttlDays || env.DEFAULT_TTL_DAYS, 90);
  const t0 = Date.now();

  // 1. Validate Alias if provided
  if (alias) {
    if (RESERVED_KEYWORDS.has(alias.toLowerCase())) {
      const error = new Error('Alias is reserved');
      error.status = 400;
      throw error;
    }
    const aliasTaken = await Url.findOne({ shortCode: alias }).lean();
    if (aliasTaken) {
      const error = new Error('Alias already in use');
      error.status = 409;
      throw error;
    }
  }

  // 2. Security Check (can check Redis cache idempotency in parallel if no alias)
  const idemKey = idempotencyKey(originalUrl);
  let cachedCode = null;
  let safety;

  if (!alias) {
    [safety, cachedCode] = await Promise.all([
      checkUrlSafety(originalUrl),
      redis.get(idemKey),
    ]);
  } else {
    safety = await checkUrlSafety(originalUrl);
  }

  if (!safety.safe) {
    const error = new Error(safety.reason);
    error.status = 403;
    throw error;
  }

  // 3. Idempotency Check (Only if NO alias is provided)
  if (!alias) {
    if (cachedCode) {
      return { shortCode: cachedCode, shortUrl: `${env.BASE_URL}/${cachedCode}` };
    }
    
    const existing = await Url.findOne({ originalUrl }).lean();
    if (existing) {
      await redis.setex(idemKey, env.CACHE_TTL, existing.shortCode);
      return { shortCode: existing.shortCode, shortUrl: `${env.BASE_URL}/${existing.shortCode}` };
    }
  }

  // 4. Generate Code if not alias
  let shortCode = alias;
  if (!shortCode) {
    let sequence = await redis.incr(COUNTER_KEY);
    if (sequence === 1) {
      await redis.set(COUNTER_KEY, START_OFFSET);
      sequence = START_OFFSET;
    }
    shortCode = getHashids().encode(sequence);
  }

  const expiresAt = ttlDays ? new Date(Date.now() + ttlDays * 86_400_000) : null;

  // 5. Persist to DB and warm both caches atomically
  await Promise.all([
    Url.create({ originalUrl, shortCode, expiresAt }),
    redis.setex(`url:${shortCode}`, env.CACHE_TTL, originalUrl),   // for redirector
    (!alias ? redis.setex(idemKey, env.CACHE_TTL, shortCode) : Promise.resolve()) // for idempotency
  ]);

  return { shortCode, shortUrl: `${env.BASE_URL}/${shortCode}` };
};