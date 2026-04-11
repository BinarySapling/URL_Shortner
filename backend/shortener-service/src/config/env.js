// Centralised env config — reads from process.env (injected by Docker Compose or .env file)

const required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

export default {
  PORT:                 parseInt(process.env.PORT)                  || 3001,
  MONGO_URI:            required('MONGO_URI'),
  REDIS_URL:            required('REDIS_URL'),
  BASE_URL:             required('BASE_URL'),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS)  || 60_000,
  RATE_LIMIT_MAX:       parseInt(process.env.RATE_LIMIT_MAX)         || 100,
  CACHE_TTL:            parseInt(process.env.CACHE_TTL)              || 86_400,
  GOOGLE_SAFE_BROWSING_KEY: process.env.GOOGLE_SAFE_BROWSING_KEY     || null,
};
