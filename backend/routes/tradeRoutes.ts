import express from 'express';
import { receiveTelegramSignal, getTradeSignals } from '../controllers/tradeController';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

router.post('/telegram-webhook', receiveTelegramSignal);
router.get('/trade-signals', authenticateToken, getTradeSignals);

export default router;
