import { Router } from 'express';
import { redirect } from '../controllers/redirect.controller.js';

const router = Router();
router.get('/:code', redirect);
export default router;