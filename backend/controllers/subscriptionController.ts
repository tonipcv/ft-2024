import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import config from '../config/config';
import { AuthenticatedRequest } from '../types/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });
const prisma = new PrismaClient();

// Criar sessão de checkout no Stripe
export const createCheckoutSession = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Futuros Tech Premium',
            },
            unit_amount: 9990, // R$ 99,90 em centavos
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/upgrade`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
  }
};

// Webhook do Stripe para lidar com pagamentos
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, config.stripeWebhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Erro na verificação do webhook:', errorMessage);
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  // Verificar se a assinatura foi completada
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Atualizar o status de assinatura do usuário no banco de dados
    const userId = parseInt(session.metadata?.userId!);
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'premium',
        paymentStatus: 'active',
      },
    });
  }

  res.status(200).send({ received: true });
};

// Obter o status da assinatura do usuário
export const getSubscriptionStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: 'Usuário não autenticado' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { plan: true, paymentStatus: true }
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.status(200).json({
      plan: user.plan,
      paymentStatus: user.paymentStatus
    });
  } catch (error) {
    console.error('Erro ao obter status da assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
