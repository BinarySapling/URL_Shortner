import redis from '../config/redis.js';
import env from '../config/env.js';

export const rateLimiter = async (req, res, next) => {
  const key = `rl:${req.ip}`;
  const now = Date.now();
  const window = env.RATE_LIMIT_WINDOW_MS;

  // ioredis pipeline
  const pipe = redis.pipeline();
  pipe.zremrangebyscore(key, '-inf', now - window);
  pipe.zadd(key, now, `${now}`);
  pipe.zcard(key);
  pipe.expire(key, Math.ceil(window / 1000));
  const results = await pipe.exec();

  // results is an array of [err, value] tuples
  const count = results[2][1];
  res.setHeader('X-RateLimit-Limit', env.RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, env.RATE_LIMIT_MAX - count));

  if (count > env.RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
};