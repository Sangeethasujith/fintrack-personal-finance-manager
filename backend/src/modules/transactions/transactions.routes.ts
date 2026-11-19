
import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import * as transactionController from './transactions.controller.js';

const router = Router();

router.use(authenticateToken);

router.post('/', transactionController.create);
router.get('/', transactionController.getAll);
router.get('/:id', transactionController.getById);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.deleteTransaction);

export default router;
