/**
 * clickFlush worker
 *
 * Responsibility: periodically flush click-count increments buffered in Redis
 * back to MongoDB, to avoid hammering the DB on every redirect.
 *
 * Pattern: read a Redis hash/sorted-set of pending increments, bulk-write to
 * MongoDB with updateMany, then delete the keys from Redis.
 *
 * TODO: implement when analytics/click-tracking is wired up.
 * For now this is a no-op stub so the service starts cleanly.
 */

export function startClickFlushWorker() {
  console.log('clickFlush worker: running in stub mode (no-op)');
}
