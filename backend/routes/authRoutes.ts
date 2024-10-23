import express from 'express';
import {
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
} from '../controllers/authController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Registrar um novo usuário
 */
router.post('/register', register);

/**
 * @route   POST /auth/login
 * @desc    Fazer login com email e senha
 */
router.post('/login', login);

/**
 * @route   POST /auth/send-reset-code
 * @desc    Enviar código de redefinição de senha para o email
 */
router.post('/send-reset-code', sendResetCode);

/**
 * @route   POST /auth/verify-code
 * @desc    Verificar código de redefinição de senha
 */
router.post('/verify-code', verifyCode);

/**
 * @route   POST /auth/reset-password
 * @desc    Redefinir a senha com o código enviado por e-mail
 */
router.post('/reset-password', resetPassword);

/**
 * @route   GET /auth/success
 * @desc    Exibir confirmação de sucesso (após redefinição de senha ou criação de conta)
 */
router.get('/success', successConfirmation);

/**
 * @route   PUT /auth/update-profile
 * @desc    Atualizar perfil do usuário
 */
router.put('/update-profile', authenticateJWT, updateProfile);

/**
 * @route   GET /auth/user-info
 * @desc    Obter informações do usuário
 */
router.get('/user-info/:userId', authenticateJWT, getUserInfo);

/**
 * @route   POST /auth/logout
 * @desc    Realizar logout
 */
router.post('/logout', authenticateJWT, logout);

/**
 * @route   GET /auth/check-auth
 * @desc    Verificar status da autenticação
 */
router.get('/check-auth', authenticateJWT, checkAuth);

/**
 * @route   POST /auth/request-password-reset
 * @desc    Solicitar redefinição de senha
 */
router.post('/request-password-reset', requestPasswordReset);

export default router;
