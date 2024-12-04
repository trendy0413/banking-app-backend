import express from 'express';
import { getUserStatement, getUser } from '../controllers/userController';

const router = express.Router();

router.get('/:userId/statement', getUserStatement);
router.get('/current', getUser);

export default router;
