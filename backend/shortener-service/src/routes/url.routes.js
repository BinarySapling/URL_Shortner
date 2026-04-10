import { Router } from 'express';
import { shorten } from '../controllers/url.controller.js';
import { validateShorten } from '../validators/url.validator.js';

const router = Router();
router.post('/shorten', validateShorten, shorten);
export default router;