import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const sendResetCode = async (email: string) => {
  try {
    const response = await api.post('/auth/send-reset-code', { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Falha ao enviar o código de redefinição.');
    }
    throw new Error('Erro de rede ao tentar enviar o código de redefinição.');
  }
};

export const verifyCode = async (email: string, code: string) => {
  const response = await api.post('/auth/verify-code', { email, code });
  return response.data;
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const response = await api.post('/auth/reset-password', { email, code, newPassword });
  return response.data;
};

export const createCheckoutSession = async () => {
  const response = await api.post('/subscriptions/create-checkout-session');
  return response.data;
};

export const getTradeSignals = async () => {
  try {
    const response = await api.get('/trade-signals');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sinais de trade:', error);
    throw error;
  }
};
