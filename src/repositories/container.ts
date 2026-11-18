import { UsuarioRepository } from './usuario.repository';
import { ClienteRepository } from './cliente.repository';
import { ProdutoRepository } from './produto.repository';
import { OrcamentoRepository } from './orcamento.repository';

import { AuthService } from '../services/auth.service';
import { ClienteService } from '../services/cliente.service';
import { ProdutoService } from '../services/produto.service';
import { OrcamentoService } from '../services/orcamento.service';

import { AuthController } from '../controllers/auth.controller';
import { ClienteController } from '../controllers/cliente.controller';
import { ProdutoController } from '../controllers/produto.controller';
import { OrcamentoController } from '../controllers/orcamento.controller';

// Repositórios com persistência Prisma ORM
export const usuarioRepository = new UsuarioRepository();
export const clienteRepository = new ClienteRepository();
export const produtoRepository = new ProdutoRepository();
export const orcamentoRepository = new OrcamentoRepository();

// Services (Recebem os repositórios diretamente via injeção de dependência)
export const authService = new AuthService(usuarioRepository);
export const clienteService = new ClienteService(clienteRepository);
export const produtoService = new ProdutoService(produtoRepository);
export const orcamentoService = new OrcamentoService(
  orcamentoRepository,
  clienteRepository,
  produtoRepository,
  usuarioRepository
);

// Controllers
export const authController = new AuthController(authService);
export const clienteController = new ClienteController(clienteService);
export const produtoController = new ProdutoController(produtoService);
export const orcamentoController = new OrcamentoController(orcamentoService);
