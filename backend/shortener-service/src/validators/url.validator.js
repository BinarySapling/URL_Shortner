import { body, validationResult } from 'express-validator';
import env from '../config/env.js';

export const validateShorten = [
  body('url')
    .customSanitizer(value => {
      // Auto-fix missing protocol
      if (value && typeof value === 'string') {
        value = value.trim();
        if (!/^https?:\/\//i.test(value)) {
          return `https://${value}`;
        }
      }
      return value;
    })
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Must be a valid http/https URL')
    .isLength({ max: 2048 })
    .withMessage('URL too long')
    .custom((value) => {
      // Cycle detection
      try {
        const parsedUrl = new URL(value);
        const baseUrl = new URL(env.BASE_URL);
        if (parsedUrl.hostname === baseUrl.hostname) {
          throw new Error('Cannot shorten a URL from this domain');
        }
        return true;
      } catch (err) {
        if (err.message === 'Cannot shorten a URL from this domain') {
          throw err;
        }
        return true; // Malformed URLs handled by isURL
      }
    }),
  body('alias')
    .optional()
    .isString().withMessage('Alias must be a string')
    .matches(/^[a-zA-Z0-9-]+$/).withMessage('Alias can only contain letters, numbers, and dashes')
    .isLength({ min: 3, max: 30 }).withMessage('Alias must be between 3 and 30 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];