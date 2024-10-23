import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Context } from 'telegraf';

const prisma = new PrismaClient();

// Função para processar mensagens do Telegram
export const processTelegramMessage = async (ctx: Context) => {
  // Verificar o token do Telegram
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!telegramToken || ctx.telegram.token !== telegramToken) {
    console.error('Token do Telegram inválido');
    await ctx.reply('Erro de autenticação');
    return;
  }

  if (ctx.message && 'text' in ctx.message) {
    const message = ctx.message.text.trim();
    
    // Validar se a mensagem não está vazia
    if (!message) {
      await ctx.reply('Mensagem vazia. Por favor, envie uma mensagem válida.');
      return;
    }

    try {
      // Armazenar a mensagem no banco de dados
      const storedMessage = await prisma.telegramMessage.create({
        data: {
          content: message,
          createdAt: new Date(),
        },
      });

      console.log('Nova mensagem recebida e armazenada:', storedMessage);
      await ctx.reply('Mensagem armazenada com sucesso');

    } catch (err) {
      console.error('Erro ao armazenar mensagem do Telegram:', err);
      await ctx.reply('Erro ao armazenar mensagem. Por favor, tente novamente mais tarde.');
    }
  } else {
    await ctx.reply('Formato de mensagem inválido. Por favor, envie apenas texto.');
  }
};

// Listar mensagens para o front-end
export const listMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.telegramMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const message = await prisma.telegramMessage.create({
      data: {
        content,
        createdAt: new Date(),
      },
    });
    res.status(201).json(message);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    res.status(500).json({ error: 'Erro ao criar mensagem' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.telegramMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};
