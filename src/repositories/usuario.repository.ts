import { prisma } from '../config/database';
import { Usuario, CargoUsuario } from '../models/usuario.model';

export class UsuarioRepository {
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const user = await prisma.usuario.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) return null;
    return {
      ...user,
      cargo: user.cargo as CargoUsuario,
    };
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const user = await prisma.usuario.findUnique({
      where: { id },
    });
    if (!user) return null;
    return {
      ...user,
      cargo: user.cargo as CargoUsuario,
    };
  }

  async listarTodos(): Promise<Usuario[]> {
    const users = await prisma.usuario.findMany({
      orderBy: { nome: 'asc' },
    });
    return users.map((u) => ({
      ...u,
      cargo: u.cargo as CargoUsuario,
    }));
  }

  async listarVendedores(): Promise<Usuario[]> {
    const users = await prisma.usuario.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
    return users.map((u) => ({
      ...u,
      cargo: u.cargo as CargoUsuario,
    }));
  }

  async criar(dados: Omit<Usuario, 'id' | 'criadoEm'>): Promise<Usuario> {
    const user = await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email.toLowerCase().trim(),
        senha: dados.senha,
        cargo: dados.cargo,
        ativo: dados.ativo ?? true,
      },
    });
    return {
      ...user,
      cargo: user.cargo as CargoUsuario,
    };
  }
}
