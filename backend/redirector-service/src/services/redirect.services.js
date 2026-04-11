import Url from '../models/Url.model.js';
import redis from '../config/redis.js';
import env from '../config/env.js';

export const resolveCode = async (shortCode) => {
  const cacheKey = `url:${shortCode}`;
  const clickKey = `clicks:${shortCode}`;

  // 1. Atomic Click Tracking in Redis (Runs on every hit)
  // We don't await this to keep the response fast, as it's fire-and-forget for the redirect
  redis.incr(clickKey).catch(err => console.error('Redis Click Error:', err));

  // 2. Cache hit check
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  // 3. Cache miss — hit DB (Only read, no update)
  const doc = await Url.findOne({ 
    shortCode, 
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] 
  }).lean();

  if (!doc) return null;

  // 4. Repopulate cache
  await redis.setex(cacheKey, env.CACHE_TTL, doc.originalUrl);
  return doc.originalUrl;
};