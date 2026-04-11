import Url from '../models/Url.model.js';
import redis from '../config/redis.js';

/**
 * ClickSync Worker
 * Periodically drains click counts from Redis and persists them to MongoDB in bulk.
 */
export const startClickSync = (intervalMs = 300000) => { // Default: Every 5 minutes
  console.log(`[Worker] ClickSync started (interval: ${intervalMs}ms)`);

  setInterval(async () => {
    try {
      // 1. Find all keys that have pending clicks
      const keys = await redis.keys('clicks:*');
      if (keys.length === 0) return;

      console.log(`[Worker] Syncing ${keys.length} short codes to MongoDB...`);

      const ops = [];

      for (const key of keys) {
        const shortCode = key.split(':')[1];
        
        // Atomic GET and DEL to avoid race conditions
        // We use a pipeline to get the value and delete the key at once
        const [getRes, delRes] = await redis.pipeline()
          .get(key)
          .del(key)
          .exec();

        const count = parseInt(getRes[1] || '0');
        if (count > 0) {
          ops.push({
            updateOne: {
              filter: { shortCode },
              update: { $inc: { clicks: count } }
            }
          });
        }
      }

      // 2. Perform Bulk Write to MongoDB
      if (ops.length > 0) {
        await Url.bulkWrite(ops);
        console.log(`[Worker] Successfully synced ${ops.length} updates.`);
      }

    } catch (err) {
      console.error('[Worker] ClickSync Error:', err);
    }
  }, intervalMs);
};
