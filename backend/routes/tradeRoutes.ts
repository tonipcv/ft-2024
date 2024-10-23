import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { createMessage, getMessages, listMessages } from '../controllers/tradeController';

const router = express.Router();

router.post('/message', authenticateJWT, createMessage);
router.get('/messages', authenticateJWT, getMessages);
router.get('/messages/list', authenticateJWT, listMessages);

export default router;
