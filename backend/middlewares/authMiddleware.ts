import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/types';
import jwt from 'jsonwebtoken';
import config from '../config/config';

// Middleware para verificar o token JWT e autenticar o usuário
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token de autenticação não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
