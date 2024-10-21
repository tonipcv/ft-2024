import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import tradeRoutes from './routes/tradeRoutes';
import { setWebhook } from './config/telegramConfig';

dotenv.config();

const app = express();
app.use(bodyParser.json());  // Middleware para processar requisições JSON
app.use(express.json());  // Isso monta as rotas em /api

// Rotas
app.use('/auth', authRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/api', tradeRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  setWebhook(); // Configura o webhook do Telegram
});
