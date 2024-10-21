import { Express } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Você pode definir um tipo mais específico para o usuário, se desejar
    }
  }
}
