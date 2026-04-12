import * as urlService from '../services/url.service.js';

export const shorten = async (req, res, next) => {
  try {
    const { url, ttlDays, alias } = req.body;
    const result = await urlService.shortenUrl(url, ttlDays, alias);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};