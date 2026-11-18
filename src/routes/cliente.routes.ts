import { Router } from 'express';
import { clienteController } from '../repositories/container';
import { authMiddleware } from '../middlewares/auth.middleware';

export const clienteRoutes = Router();

clienteRoutes.use(authMiddleware);

clienteRoutes.post('/', clienteController.criar);
clienteRoutes.get('/', clienteController.listar);
clienteRoutes.get('/:id', clienteController.buscarPorId);
clienteRoutes.put('/:id', clienteController.atualizar);
clienteRoutes.delete('/:id', clienteController.excluir);
