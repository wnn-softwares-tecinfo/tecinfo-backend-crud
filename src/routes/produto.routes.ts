import { Router } from 'express';
import { produtoController } from '../repositories/container';
import { authMiddleware } from '../middlewares/auth.middleware';

export const produtoRoutes = Router();

produtoRoutes.use(authMiddleware);

// Endpoints auxiliares para dropdowns do front-end
produtoRoutes.get('/auxiliares/familias', produtoController.listarFamilias);
produtoRoutes.get('/auxiliares/unidades', produtoController.listarUnidades);

// Busca por código curto do orçamento (ex: 00085)
produtoRoutes.get('/codigo/:codigo', produtoController.buscarPorCodigo);

// CRUD de produtos
produtoRoutes.post('/', produtoController.criar);
produtoRoutes.get('/', produtoController.listar);
produtoRoutes.get('/:id', produtoController.buscarPorId);
produtoRoutes.put('/:id', produtoController.atualizar);
produtoRoutes.patch('/:id/estoque', produtoController.movimentarEstoque);
produtoRoutes.delete('/:id', produtoController.excluir);
