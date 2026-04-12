import { performance } from 'perf_hooks';
import Url from '../models/Url.model.js';
import redis from '../config/redis.js';
import env from '../config/env.js';

export const resolveCode = async (shortCode) => {
  const cacheKey = `url:${shortCode}`;
  const clickKey = `clicks:${shortCode}`;
  const timings = { redis: 0, db: 0 };

  // 1. Cache hit check (READ FIRST to ensure lowest latency before writes)
  const startRedis = performance.now();
  const cached = await redis.get(cacheKey);
  timings.redis = Math.round(performance.now() - startRedis);

  // 2. Atomic Click Tracking (Async fire-and-forget AFTER read leaves the event loop)
  redis.incr(clickKey).catch(err => console.error('Redis Click Error:', err));

  if (cached === 'EXPIRED') {
    console.log(`[Redirect] REDIS HIT for ${shortCode} (EXPIRED) (${timings.redis}ms)`);
    return { originalUrl: null, expired: true, timings };
  } else if (cached) {
    console.log(`[Redirect] REDIS HIT for ${shortCode} (${timings.redis}ms)`);
    return { originalUrl: cached, expired: false, timings };
  }

  // 3. Cache miss — hit DB
  const startDb = performance.now();
  const doc = await Url.findOne({ shortCode }).lean();
  timings.db = Math.round(performance.now() - startDb);

  if (!doc) {
    console.log(`[Redirect] CACHE MISS for ${shortCode} - NOT FOUND in DB`);
    return { originalUrl: null, expired: false, timings };
  }

  const isExpired = doc.expiresAt && new Date(doc.expiresAt) < new Date();
  
  if (isExpired) {
    console.log(`[Redirect] CACHE MISS for ${shortCode} - EXPIRED in DB`);
    redis.setex(cacheKey, env.CACHE_TTL, 'EXPIRED');
    return { originalUrl: null, expired: true, timings };
  }

  // 4. Repopulate cache (Async)
  console.log(`[Redirect] CACHE MISS for ${shortCode}. DB HIT (${timings.db}ms)`);
  redis.setex(cacheKey, env.CACHE_TTL, doc.originalUrl);

  return { originalUrl: doc.originalUrl, expired: false, timings };
};