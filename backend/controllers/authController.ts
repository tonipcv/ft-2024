import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../config/config';

const prisma = new PrismaClient();

// Configuração do transporter do nodemailer usando Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Função para enviar e-mail
const sendEmail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });
};

// Registrar um novo usuário
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        plan: 'FREE', // Define o plano como FREE por padrão
        paymentStatus: 'PENDING', // Define o status de pagamento como PENDING por padrão
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

// Fazer login de um usuário
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Senha incorreta' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,  // Certifique-se de que o campo 'plan' existe no modelo User do Prisma
      }
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ error: 'Erro interno do servidor ao fazer login' });
  }
};

// Enviar código de redefinição de senha para o e-mail
export const sendResetCode = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'E-mail não encontrado na base de dados.' });
      return;
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.user.update({
      where: { email },
      data: { resetCode },
    });

    // Enviar e-mail com o código de redefinição
    await sendEmail(
      email,
      'Código de Redefinição de Senha',
      `Seu código de redefinição de senha é: ${resetCode}`
    );

    res.status(200).json({ message: 'Código de redefinição enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar código de redefinição:', error);
    res.status(500).json({ error: 'Erro ao enviar código de redefinição' });
  }
};

// Verificar código enviado por e-mail
export const verifyCode = async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetCode !== code) {
      res.status(400).json({ error: 'Código inválido' });
      return;
    }

    // Limpar o código de redefinição após a verificação
    await prisma.user.update({
      where: { email },
      data: { resetCode: null },
    });

    res.status(200).json({ message: 'Código verificado com sucesso' });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    res.status(500).json({ error: 'Erro ao verificar código' });
  }
};

// Redefinir senha
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetCode !== code) {
      res.status(400).json({ error: 'Código inválido ou expirado' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetCode: null,
      },
    });

    res.status(200).json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
};

// Exibir confirmação de sucesso
export const successConfirmation = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'Operação concluída com sucesso.' });
};

// Atualizar perfil do usuário
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { userId, name, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });
    res.status(200).json({ message: 'Perfil atualizado com sucesso', user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

// Obter informações do usuário
export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { id: true, name: true, email: true, plan: true, paymentStatus: true },
    });
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    res.status(500).json({ error: 'Erro ao obter informações do usuário' });
  }
};

// Logout (se necessário no backend)
export const logout = async (req: Request, res: Response): Promise<void> => {
  // No backend, o logout geralmente envolve apenas a resposta ao cliente
  res.status(200).json({ message: 'Logout realizado com sucesso' });
};

// Verificar status da autenticação
export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  if (req.user) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(401).json({ isAuthenticated: false, user: null });
  }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    // Gerar um código de redefinição aleatório
    const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Salvar o código de redefinição no banco de dados
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        resetCode,
        resetCodeExpires: new Date(Date.now() + 3600000) // Expira em 1 hora
      },
    });

    // Enviar e-mail com o código de redefinição
    await sendEmail(
      user.email,
      'Redefinição de Senha',
      `Seu código de redefinição de senha é: ${resetCode}`
    );

    res.status(200).json({ message: 'E-mail de redefinição de senha enviado' });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação de redefinição de senha' });
  }
};

export default {
  register,
  login,
  sendResetCode,
  verifyCode,
  resetPassword,
  successConfirmation,
  updateProfile,
  getUserInfo,
  logout,
  checkAuth,
  requestPasswordReset
};
