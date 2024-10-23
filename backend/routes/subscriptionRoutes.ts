import express from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  getUserSubscription,
  cancelSubscription,
  updateSubscription
} from '../controllers/subscriptionController';
import { authenticateJWT } from '../middlewares/authMiddleware'; // Assumindo que você tem um middleware de autenticação

const router = express.Router();

// Rota para criar uma sessão de checkout
router.post('/create-checkout-session', authenticateJWT, createCheckoutSession);

// Rota para lidar com webhooks do Stripe
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

// Rota para obter informações da assinatura do usuário
router.get('/user-subscription', authenticateJWT, getUserSubscription);

// Rota para cancelar a assinatura
router.post('/cancel-subscription', authenticateJWT, cancelSubscription);

// Rota para atualizar a assinatura (por exemplo, mudar de plano)
router.post('/update-subscription', authenticateJWT, updateSubscription);

export default router;
