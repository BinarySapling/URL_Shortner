import { resolveCode } from '../services/redirect.services.js';

export const redirect = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { originalUrl, timings } = await resolveCode(code);
    
    // Set professional performance diagnostics header
    res.set('Server-Timing', `redis;dur=${timings.redis}, db;dur=${timings.db}`);

    if (!originalUrl) {
      return res.status(404).json({ error: 'URL not found or expired' });
    }
    
    res.redirect(301, originalUrl);
  } catch (err) {
    next(err);
  }
};