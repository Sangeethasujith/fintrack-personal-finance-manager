import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import * as categoryController from './category.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/', categoryController.getAll);

export default router;