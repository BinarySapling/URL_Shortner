import { performance } from 'perf_hooks';
import Url from '../models/Url.model.js';
import redis from '../config/redis.js';
import env from '../config/env.js';

export const resolveCode = async (shortCode) => {
  const cacheKey = `url:${shortCode}`;
  const clickKey = `clicks:${shortCode}`;
  const timings = { redis: 0, db: 0 };

  // 1. Atomic Click Tracking (Async)
  redis.incr(clickKey).catch(err => console.error('Redis Click Error:', err));

  // 2. Cache hit check
  const startRedis = performance.now();
  const cached = await redis.get(cacheKey);
  timings.redis = Math.round(performance.now() - startRedis);

  if (cached) {
    console.log(`[Redirect] REDIS HIT for ${shortCode} (${timings.redis}ms)`);
    return { originalUrl: cached, timings };
  }

  // 3. Cache miss — hit DB
  const startDb = performance.now();
  const doc = await Url.findOne({ 
    shortCode, 
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] 
  }).lean();
  timings.db = Math.round(performance.now() - startDb);

  if (!doc) return { originalUrl: null, timings };

  // 4. Repopulate cache (Async)
  console.log(`[Redirect] CACHE MISS for ${shortCode}. DB HIT (${timings.db}ms)`);
  redis.setex(cacheKey, env.CACHE_TTL, doc.originalUrl);

  return { originalUrl: doc.originalUrl, timings };
};