import Redis from 'ioredis';
import env from './env.js';

// Upstash Redis uses TLS (rediss://) — enable tls option automatically
const isTLS = env.REDIS_URL.startsWith('rediss://');

const client = new Redis(env.REDIS_URL, {
  lazyConnect: false,
  maxRetriesPerRequest: 0, // Fail fast for high performance redirects
  connectTimeout: 10000,   // 10s connection timeout
  keepAlive: 10000,        // TCP Keep-Alive
  family: 0,               // Force IPv4 to prevent Node.js IPv6 DNS resolution lag spikes with Upstash
  tls: isTLS ? {} : undefined,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

client.on('error', (err) => console.error('Redis error', err));
client.on('connect', () => console.log('Redis connected'));

export default client;