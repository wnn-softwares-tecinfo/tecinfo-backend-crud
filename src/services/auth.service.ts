import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { CriarUsuarioDTO, LoginDTO, RespostaLoginDTO } from '../dtos/auth.dto';
import { AppError } from '../utils/AppError';
import { Usuario } from '../models/usuario.model';

export class AuthService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async autenticar({ email, senha }: LoginDTO): Promise<RespostaLoginDTO> {
    if (!email || !senha) {
      throw new AppError('E-mail e senha são obrigatórios.', 400);
    }

    const usuario = await this.usuarioRepository.buscarPorEmail(email);

    if (!usuario || !usuario.ativo) {
      throw new AppError('Credenciais inválidas ou usuário inativo.', 401);
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    const secret = process.env.JWT_SECRET || 'mr_construcao_secret_key_super_segura_tecinfo_2026';
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        cargo: usuario.cargo,
      },
      secret,
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
      },
    };
  }

  async cadastrarUsuario(dados: CriarUsuarioDTO): Promise<Omit<Usuario, 'senha'>> {
    const jaExiste = await this.usuarioRepository.buscarPorEmail(dados.email);

    if (jaExiste) {
      throw new AppError('Já existe um usuário cadastrado com este e-mail.', 400);
    }

    const senhaHash = await bcrypt.hash(dados.senha, 8);

    const usuario = await this.usuarioRepository.criar({
      nome: dados.nome,
      email: dados.email,
      senha: senhaHash,
      cargo: dados.cargo,
      ativo: true,
    });

    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  async listarVendedores(): Promise<Array<{ id: string; nome: string; email: string }>> {
    const vendedores = await this.usuarioRepository.listarVendedores();
    return vendedores.map((v) => ({
      id: v.id,
      nome: v.nome,
      email: v.email,
    }));
  }

  async listarTodos(): Promise<Array<Omit<Usuario, 'senha'>>> {
    const usuarios = await this.usuarioRepository.listarTodos();
    return usuarios.map(({ senha: _, ...resto }) => resto);
  }
}
