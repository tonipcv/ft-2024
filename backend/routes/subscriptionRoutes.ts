import express from 'express';
import { createCheckoutSession } from '../controllers/subscriptionController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /subscriptions/create-checkout-session
 * @desc    Criar uma sessão de checkout no Stripe para o pagamento da assinatura
 * @access  Privado (Apenas usuários autenticados)
 */
router.post('/create-checkout-session', requireAuth, createCheckoutSession);

export default router;
