import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { clienteRoutes } from './cliente.routes';
import { produtoRoutes } from './produto.routes';
import { orcamentoRoutes } from './orcamento.routes';

export const routes = Router();

// Rota de status/healthcheck da API
routes.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    aplicacao: 'MR - Material de Construção API',
    versao: '1.0.0',
    dataHora: new Date().toISOString(),
  });
});

routes.use('/auth', authRoutes);
routes.use('/usuarios', authRoutes);
routes.use('/clientes', clienteRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/orcamentos', orcamentoRoutes);
