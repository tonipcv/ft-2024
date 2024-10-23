import { Request, Response } from 'express';
import { PrismaClient, User, Subscription } from '@prisma/client';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
});

// Configuração do transporter do nodemailer
const transporter = nodemailer.createTransport({
  // Configuração do seu serviço de e-mail
  // Exemplo para Gmail:
  service: 'mailtrap',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Função para enviar e-mails
const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

// Templates de e-mail
const emailTemplates = {
  subscriptionCreated: (userName: string) => `
    <h1>Bem-vindo, ${userName}!</h1>
    <p>Sua assinatura foi criada com sucesso. Obrigado por se juntar a nós!</p>
    <p>Aproveite todos os benefícios da sua nova assinatura.</p>
  `,
  subscriptionCancelled: (userName: string) => `
    <h1>Assinatura Cancelada</h1>
    <p>Olá ${userName},</p>
    <p>Sua assinatura foi cancelada com sucesso. Esperamos vê-lo novamente em breve!</p>
    <p>Se você mudar de ideia, você pode se inscrever novamente a qualquer momento.</p>
  `,
  subscriptionUpdated: (userName: string, newPlanName: string) => `
    <h1>Assinatura Atualizada</h1>
    <p>Olá ${userName},</p>
    <p>Sua assinatura foi atualizada com sucesso para o plano ${newPlanName}.</p>
    <p>Aproveite seus novos benefícios!</p>
  `,
};

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/upgrade`,
      client_reference_id: userId.toString(),
      metadata: {
        userId: user.id,
        userName: user.name || '',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { paymentStatus: 'PENDING' },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    // Lidar com diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed':
        // Atualizar o status da assinatura do usuário
        break;
      case 'invoice.payment_succeeded':
        // Atualizar o status do pagamento
        break;
      // Adicione mais casos conforme necessário
    }

    res.json({received: true});
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

export const getUserSubscription = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as User).id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user || !user.subscription) {
      res.status(404).json({ error: 'Assinatura não encontrada' });
      return;
    }

    res.status(200).json(user.subscription);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter informações da assinatura' });
  }
};

export const cancelSubscription = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as User).id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user || !user.subscription) {
      res.status(404).json({ error: 'Assinatura não encontrada' });
      return;
    }

    const subscription = user.subscription;

    const canceledSubscription = await stripe.subscriptions.cancel(
      subscription.stripeSubscriptionId
    );

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: {
          update: {
            status: canceledSubscription.status,
          },
        },
      },
    });

    // Enviar e-mail de cancelamento
    await sendEmail(
      user.email,
      'Assinatura Cancelada',
      emailTemplates.subscriptionCancelled(user.name || 'Usuário')
    );

    res.status(200).json({ message: 'Assinatura cancelada com sucesso', subscription: canceledSubscription });
  } catch (error) {
    console.error('Erro ao cancelar a assinatura:', error);
    res.status(500).json({ error: 'Erro ao cancelar a assinatura' });
  }
};

export const updateSubscription = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as User).id;
  const { newPriceId, newPlanName } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user || !user.subscription) {
      res.status(404).json({ error: 'Assinatura não encontrada' });
      return;
    }

    const subscription = user.subscription;

    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      { items: [{ id: subscription.stripeSubscriptionItemId, price: newPriceId }] }
    );

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: {
          update: {
            stripePriceId: newPriceId,
          },
        },
      },
    });

    // Enviar e-mail de atualização
    await sendEmail(
      user.email,
      'Assinatura Atualizada',
      emailTemplates.subscriptionUpdated(user.name || 'Usuário', newPlanName)
    );

    res.status(200).json({ message: 'Assinatura atualizada com sucesso', subscription: updatedSubscription });
  } catch (error) {
    console.error('Erro ao atualizar a assinatura:', error);
    res.status(500).json({ error: 'Erro ao atualizar a assinatura' });
  }
};

export default {
  createCheckoutSession,
  handleWebhook,
  getUserSubscription,
  cancelSubscription,
  updateSubscription,
};
