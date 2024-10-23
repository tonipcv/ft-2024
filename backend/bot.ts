import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.BOT_TOKEN!);

prisma.$connect()
  .then(() => console.log('Conectado ao banco de dados via Prisma'))
  .catch((error) => console.error('Erro ao conectar via Prisma:', error));

bot.on(message('text'), async (ctx) => {
    console.log(ctx.message);

    try {
        // Salvar a mensagem no banco de dados como um TradeSignal
        const savedSignal = await prisma.tradeSignal.create({
            data: {
                message: ctx.message.text,
                // createdAt é preenchido automaticamente pelo Prisma
            },
        });
        console.log('Sinal de trade salvo:', savedSignal);
        
        // Responder ao usuário
        await ctx.reply('Sinal de trade recebido e armazenado com sucesso.');
    } catch (error) {
        console.error('Erro ao processar o sinal de trade:', error);
        await ctx.reply('Erro ao processar o sinal de trade. Por favor, tente novamente.');
    }
});

bot.launch();

console.log('Bot is running...');

// Encerrar o bot e fechar a conexão do Prisma quando o processo for encerrado
process.once('SIGINT', async () => {
    bot.stop('SIGINT');
    await prisma.$disconnect();
});

process.once('SIGTERM', async () => {
    bot.stop('SIGTERM');
    await prisma.$disconnect();
});
