import { prisma } from '../config/database';
import { Cliente } from '../models/cliente.model';
import { Cliente as ClientePrisma } from '@prisma/client';

export class ClienteRepository {
  private mapearParaDominio(cli: ClientePrisma): Cliente {
    return {
      id: cli.id,
      nomeCliente: cli.nomeCliente,
      telefone: cli.telefone,
      rua: cli.rua,
      numero: cli.numero,
      complemento: cli.complemento || undefined,
      bairro: cli.bairro,
      cidade: cli.cidade,
      cep: cli.cep,
      pontoReferencia: cli.pontoReferencia || undefined,
      criadoEm: cli.criadoEm,
      atualizadoEm: cli.atualizadoEm,
    };
  }

  async criar(dados: Omit<Cliente, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Cliente> {
    const cli = await prisma.cliente.create({
      data: {
        nomeCliente: dados.nomeCliente,
        telefone: dados.telefone,
        rua: dados.rua,
        numero: dados.numero,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.cidade,
        cep: dados.cep,
        pontoReferencia: dados.pontoReferencia,
      },
    });
    return this.mapearParaDominio(cli);
  }

  async listar(busca?: string): Promise<Cliente[]> {
    if (!busca) {
      const clientes = await prisma.cliente.findMany({
        orderBy: { nomeCliente: 'asc' },
      });
      return clientes.map((c) => this.mapearParaDominio(c));
    }

    const termo = busca.trim();
    const clientes = await prisma.cliente.findMany({
      where: {
        OR: [
          { nomeCliente: { contains: termo, mode: 'insensitive' } },
          { telefone: { contains: termo, mode: 'insensitive' } },
          { cidade: { contains: termo, mode: 'insensitive' } },
        ],
      },
      orderBy: { nomeCliente: 'asc' },
    });
    return clientes.map((c) => this.mapearParaDominio(c));
  }

  async buscarPorId(id: string): Promise<Cliente | null> {
    const cli = await prisma.cliente.findUnique({
      where: { id },
    });
    return cli ? this.mapearParaDominio(cli) : null;
  }

  async atualizar(
    id: string,
    dados: Partial<Omit<Cliente, 'id' | 'criadoEm' | 'atualizadoEm'>>
  ): Promise<Cliente | null> {
    try {
      const cli = await prisma.cliente.update({
        where: { id },
        data: dados,
      });
      return this.mapearParaDominio(cli);
    } catch {
      return null;
    }
  }

  async excluir(id: string): Promise<boolean> {
    try {
      await prisma.cliente.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
