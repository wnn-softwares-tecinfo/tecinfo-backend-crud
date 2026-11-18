import { Router } from 'express';
import { authController } from '../repositories/container';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

export const authRoutes = Router();

// Rota pública de login
authRoutes.post('/login', authController.login);

// Rotas de usuários protegidas
authRoutes.get('/vendedores', authMiddleware, authController.listarVendedores);
authRoutes.get('/usuarios', authMiddleware, requireRole(['ADMIN']), authController.listarTodos);
authRoutes.post('/usuarios', authMiddleware, requireRole(['ADMIN']), authController.cadastrar);
