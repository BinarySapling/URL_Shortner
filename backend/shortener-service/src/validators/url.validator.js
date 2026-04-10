import { body, validationResult } from 'express-validator';

export const validateShorten = [
  body('url')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Must be a valid http/https URL')
    .isLength({ max: 2048 })
    .withMessage('URL too long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];