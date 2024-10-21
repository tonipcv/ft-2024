import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/types';

const prisma = new PrismaClient();

// Criar um novo sinal de trade (vindo do Telegram ou inserido manualmente)
export const createTradeSignal = async (req: Request, res: Response) => {
  const { message } = req.body; // Captura a mensagem do corpo da requisição

  try {
    const tradeSignal = await prisma.tradeSignal.create({
      data: {
        message, // Armazena a mensagem do sinal
      },
    });

    res.status(201).json(tradeSignal); // Retorna o sinal criado
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar sinal de trade' });
  }
};

// Receber sinal do Telegram via webhook
export const receiveTelegramSignal = async (req: Request, res: Response) => {
  const update = req.body;

  // Verifica se a atualização contém uma mensagem
  if (update.message && update.message.text) {
    try {
      const tradeSignal = await prisma.tradeSignal.create({
        data: {
          message: update.message.text,
        },
      });

      console.log('Novo sinal de trade recebido:', tradeSignal);
      res.status(200).send('OK');
    } catch (err) {
      console.error('Erro ao processar sinal do Telegram:', err);
      res.status(500).json({ error: 'Erro ao processar sinal do Telegram' });
    }
  } else {
    res.status(200).send('OK'); // Responde OK mesmo se não for uma mensagem
  }
};

// Obter todos os sinais de trade (Apenas para usuários Premium)
export const getTradeSignals = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.plan !== 'PREMIUM') {
      res.status(403).json({ error: 'Acesso negado. Apenas usuários Premium podem ver os sinais.' });
      return;
    }

    const signals = await prisma.tradeSignal.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(signals);
  } catch (error) {
    console.error('Erro ao buscar sinais de trade:', error);
    res.status(500).json({ error: 'Erro ao buscar sinais de trade' });
  }
};
