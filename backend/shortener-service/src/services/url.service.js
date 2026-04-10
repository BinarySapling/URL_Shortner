import Url from '../models/Url.model.js';
import redis from '../config/redis.js';
import env from '../config/env.js';

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function toBase62(num) {
  if (num === 0) return BASE62[0];
  let result = '';
  while (num > 0) {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

// Extract numeric portion of MongoDB ObjectId for base62 seeding
function objectIdToNumber(id) {
  return parseInt(id.toString().slice(-8), 16);
}

export const shortenUrl = async (originalUrl, ttlDays = null) => {
  // Idempotent: return existing code if URL was already shortened
  const existing = await Url.findOne({ originalUrl }).lean();
  if (existing) {
    return { shortCode: existing.shortCode, shortUrl: `${env.BASE_URL}/${existing.shortCode}` };
  }

  const doc = await Url.create({ originalUrl, shortCode: '__tmp__' });
  const shortCode = toBase62(objectIdToNumber(doc._id));
  const expiresAt = ttlDays ? new Date(Date.now() + ttlDays * 86_400_000) : null;

  await Url.updateOne({ _id: doc._id }, { shortCode, expiresAt });

  // Warm the Redis cache immediately on write
  await redis.setex(`url:${shortCode}`, env.CACHE_TTL, originalUrl);

  return { shortCode, shortUrl: `${env.BASE_URL}/${shortCode}` };
};