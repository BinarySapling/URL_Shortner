import { resolveCode } from '../services/redirect.services.js';

export const redirect = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { originalUrl, expired, timings } = await resolveCode(code);
    
    // Set professional performance diagnostics header
    res.set('Server-Timing', `redis;dur=${timings.redis}, db;dur=${timings.db}`);

    if (!originalUrl) {
      if (expired) {
        return res.redirect(302, '/not-found?reason=expired');
      }
      return res.redirect(302, '/not-found');
    }
    
    res.redirect(301, originalUrl);
  } catch (err) {
    next(err);
  }
};