import { Router } from 'express';
import { orcamentoController } from '../repositories/container';
import { authMiddleware } from '../middlewares/auth.middleware';

export const orcamentoRoutes = Router();

orcamentoRoutes.use(authMiddleware);

orcamentoRoutes.post('/', orcamentoController.criar);
orcamentoRoutes.get('/', orcamentoController.listar);
orcamentoRoutes.get('/:id', orcamentoController.buscarPorId);
orcamentoRoutes.get('/:id/imprimir', orcamentoController.imprimir);
orcamentoRoutes.patch('/:id/status', orcamentoController.atualizarStatus);
