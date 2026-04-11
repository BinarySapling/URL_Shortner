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

// Build a stable Redis key from any URL string
const idempotencyKey = (url) =>
  `idem:${createHash('sha256').update(url).digest('hex').slice(0, 16)}`;

export const shortenUrl = async (originalUrl, ttlDays = null) => {
  const t0 = Date.now();

  // 1. Run Security Check + Redis Idempotency lookup IN PARALLEL
  // These two are completely independent, so no need to wait for one before the other.
  const idemKey = idempotencyKey(originalUrl);
  const [safety, cachedCode] = await Promise.all([
    checkUrlSafety(originalUrl),
    redis.get(idemKey),
  ]);

  console.log(`[Shorten] parallel checks: ${Date.now() - t0}ms`);

  if (!safety.safe) {
    const error = new Error(safety.reason);
    error.status = 403;
    throw error;
  }

  // 2a. Redis Idempotency HIT — return immediately, no DB needed
  if (cachedCode) {
    console.log(`[Shorten] Redis idem HIT (${Date.now() - t0}ms)`);
    return { shortCode: cachedCode, shortUrl: `${env.BASE_URL}/${cachedCode}` };
  }

  // 2b. Redis miss — check MongoDB as fallback
  const t1 = Date.now();
  const existing = await Url.findOne({ originalUrl }).lean();
  console.log(`[Shorten] MongoDB idem lookup: ${Date.now() - t1}ms`);

  if (existing) {
    // Warm Redis so future requests skip the DB
    await redis.setex(idemKey, env.CACHE_TTL, existing.shortCode);
    return { shortCode: existing.shortCode, shortUrl: `${env.BASE_URL}/${existing.shortCode}` };
  }

  // 3. New URL — Distributed ID via Redis counter
  let sequence = await redis.incr(COUNTER_KEY);
  if (sequence === 1) {
    await redis.set(COUNTER_KEY, START_OFFSET);
    sequence = START_OFFSET;
  }

  const shortCode = getHashids().encode(sequence);
  const expiresAt = ttlDays ? new Date(Date.now() + ttlDays * 86_400_000) : null;

  // 4. Persist to DB and warm both caches atomically
  await Promise.all([
    Url.create({ originalUrl, shortCode, expiresAt }),
    redis.setex(`url:${shortCode}`, env.CACHE_TTL, originalUrl),   // for redirector
    redis.setex(idemKey, env.CACHE_TTL, shortCode),                 // for idempotency
  ]);

  console.log(`[Shorten] total (new URL): ${Date.now() - t0}ms`);
  return { shortCode, shortUrl: `${env.BASE_URL}/${shortCode}` };
};