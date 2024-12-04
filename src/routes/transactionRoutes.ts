import { Router, Request, Response } from 'express';
import { TransactionController } from '../controllers/transactionController';

const router = Router();
router.post('/', async (req: Request, res: Response) => {
  await TransactionController.handleTransaction(req, res)
});

export default router;