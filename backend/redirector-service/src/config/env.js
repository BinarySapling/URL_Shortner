// Centralised env config — reads from process.env (injected by Docker Compose or .env file)

const required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
};

export default {
  PORT:      parseInt(process.env.PORT)       || 3002,
  MONGO_URI: required('MONGO_URI'),
  REDIS_URL: required('REDIS_URL'),
  CACHE_TTL: parseInt(process.env.CACHE_TTL)  || 86_400,
};
