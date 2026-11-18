import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body;
    const resultado = await this.authService.autenticar({ email, senha });
    res.status(200).json(resultado);
  };

  cadastrar = async (req: Request, res: Response): Promise<void> => {
    const { nome, email, senha, cargo } = req.body;
    const novoUsuario = await this.authService.cadastrarUsuario({
      nome,
      email,
      senha,
      cargo,
    });
    res.status(201).json(novoUsuario);
  };

  listarVendedores = async (_req: Request, res: Response): Promise<void> => {
    const vendedores = await this.authService.listarVendedores();
    res.status(200).json(vendedores);
  };

  listarTodos = async (_req: Request, res: Response): Promise<void> => {
    const usuarios = await this.authService.listarTodos();
    res.status(200).json(usuarios);
  };
}
