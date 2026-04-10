import Url from '../models/Url.model.js';
import redis from '../config/redis.js';
import env from '../config/env.js';

export const resolveCode = async (shortCode) => {
  // 1. Cache hit
  const cached = await redis.get(`url:${shortCode}`);
  if (cached) return cached;

  // 2. Cache miss — hit DB
  const doc = await Url.findOneAndUpdate(
    { shortCode, $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] },
    { $inc: { clicks: 1 } },
    { new: true, lean: true }
  );

  if (!doc) return null;

  // 3. Repopulate cache
  await redis.setex(`url:${shortCode}`, env.CACHE_TTL, doc.originalUrl);
  return doc.originalUrl;
};