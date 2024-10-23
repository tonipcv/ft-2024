import express from 'express';
import subscriptionRoutes from './routes/subscriptionRoutes';
import tradeRoutes from './routes/tradeRoutes';
import { Telegraf } from 'telegraf';

const app = express();

// Outros middlewares e configurações...

// Adicione as rotas de assinatura
app.use('/api/subscription', subscriptionRoutes);

// Rotas de trade
app.use('/api/trade', tradeRoutes);

// Configuração do bot do Telegram
if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN não está definido no ambiente');
}
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

if (!process.env.SERVER_URL) {
  throw new Error('SERVER_URL não está definido no ambiente');
}
bot.telegram.setWebhook(`${process.env.SERVER_URL}/api/trade/telegram-webhook`);

// Use o middleware do bot para processar atualizações
app.use(bot.webhookCallback('/api/trade/telegram-webhook'));

// Outras configurações de rota...

export default app;
