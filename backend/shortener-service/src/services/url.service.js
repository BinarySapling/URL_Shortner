import Url from '../models/Url.model.js';
import redis from '../config/redis.js';
import env from '../config/env.js';

const BASE62       = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const COUNTER_KEY  = 'url_shortener:counter';
const START_OFFSET = 100000;

function toBase62(num) {
  if (num === 0) return BASE62[0];
  let result = '';
  while (num > 0) {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

export const shortenUrl = async (originalUrl, ttlDays = null) => {
  // 1. Idempotency Check: return existing code if URL was already shortened
  const existing = await Url.findOne({ originalUrl }).lean();
  if (existing) {
    return { shortCode: existing.shortCode, shortUrl: `${env.BASE_URL}/${existing.shortCode}` };
  }

  // 2. Distributed Unique ID: Get next global sequence from Redis
  let sequence = await redis.incr(COUNTER_KEY);
  
  // Seed the counter if it's brand new
  if (sequence === 1) {
    await redis.set(COUNTER_KEY, START_OFFSET);
    sequence = START_OFFSET;
  }

  const shortCode = toBase62(sequence);
  const expiresAt = ttlDays ? new Date(Date.now() + ttlDays * 86_400_000) : null;

  // 3. Persistence: Create the final document in one atomic operation
  await Url.create({ 
    originalUrl, 
    shortCode, 
    expiresAt 
  });

  // 4. Cache Warming: Populate Redis for the redirector service
  await redis.setex(`url:${shortCode}`, env.CACHE_TTL, originalUrl);

  return { shortCode, shortUrl: `${env.BASE_URL}/${shortCode}` };
};