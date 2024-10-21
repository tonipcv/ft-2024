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
  checkAuth
} from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';

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
router.put('/update-profile', authenticateToken, updateProfile);

/**
 * @route   GET /auth/user-info
 * @desc    Obter informações do usuário
 */
router.get('/user-info/:userId', authenticateToken, getUserInfo);

/**
 * @route   POST /auth/logout
 * @desc    Realizar logout
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /auth/check-auth
 * @desc    Verificar status da autenticação
 */
router.get('/check-auth', authenticateToken, checkAuth);

export default router;
