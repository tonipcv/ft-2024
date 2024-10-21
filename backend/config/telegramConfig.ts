import axios from 'axios';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export const setWebhook = async () => {
  try {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${process.env.WEBHOOK_URL}`);
    console.log('Webhook configurado:', res.data);
  } catch (error) {
    console.error('Erro ao configurar webhook:', error);
  }
};
