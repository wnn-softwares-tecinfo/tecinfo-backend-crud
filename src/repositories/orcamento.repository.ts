import { prisma } from '../config/database';
import {
  Orcamento,
  StatusOrcamento,
  FormaPagamento,
  ItemOrcamento,
} from '../models/orcamento.model';
import {
  Orcamento as OrcamentoPrisma,
  ItemOrcamento as ItemOrcamentoPrisma,
  Cliente as ClientePrisma,
} from '@prisma/client';

export interface FiltrosOrcamento {
  status?: StatusOrcamento;
  vendedorId?: string;
  clienteId?: string;
}

type OrcamentoComRelacoes = OrcamentoPrisma & {
  itens: ItemOrcamentoPrisma[];
  cliente?: ClientePrisma | null;
};

export class OrcamentoRepository {
  private mapearParaDominio(o: OrcamentoComRelacoes): Orcamento {
    return {
      id: o.id,
      numeroOrcamento: o.numeroOrcamento,
      vendedorId: o.vendedorId,
      vendedorNome: o.vendedorNome,
      clienteId: o.clienteId,
      clienteNome: o.clienteNome,
      clienteTelefone: o.cliente?.telefone,
      clienteEndereco: o.cliente
        ? {
            rua: o.cliente.rua,
            numero: o.cliente.numero,
            complemento: o.cliente.complemento || undefined,
            bairro: o.cliente.bairro,
            cidade: o.cliente.cidade,
            cep: o.cliente.cep,
            pontoReferencia: o.cliente.pontoReferencia || undefined,
          }
        : undefined,
      formaPagamento: o.formaPagamento as FormaPagamento,
      numeroParcelas: o.numeroParcelas || undefined,
      percentualDesconto: o.percentualDesconto ? Number(o.percentualDesconto) : undefined,
      observacoes: o.observacoes || undefined,
      valorTotal: Number(o.valorTotal),
      status: o.status as StatusOrcamento,
      itens: (o.itens || []).map(
        (it): ItemOrcamento => ({
          id: it.id,
          orcamentoId: it.orcamentoId,
          produtoId: it.produtoId,
          codigoProduto: it.codigoProduto,
          nomeProduto: it.nomeProduto,
          quantidade: it.quantidade,
          valorUnitario: Number(it.valorUnitario),
          subtotal: Number(it.subtotal),
        })
      ),
      criadoEm: o.criadoEm,
      atualizadoEm: o.atualizadoEm,
    };
  }

  async criar(dados: Omit<Orcamento, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<Orcamento> {
    const o = await prisma.orcamento.create({
      data: {
        numeroOrcamento: dados.numeroOrcamento,
        vendedorId: dados.vendedorId,
        vendedorNome: dados.vendedorNome,
        clienteId: dados.clienteId,
        clienteNome: dados.clienteNome,
        formaPagamento: dados.formaPagamento,
        numeroParcelas: dados.numeroParcelas,
        percentualDesconto: dados.percentualDesconto,
        observacoes: dados.observacoes,
        valorTotal: dados.valorTotal,
        status: dados.status,
        itens: {
          create: dados.itens.map((it) => ({
            produtoId: it.produtoId,
            codigoProduto: it.codigoProduto,
            nomeProduto: it.nomeProduto,
            quantidade: it.quantidade,
            valorUnitario: it.valorUnitario,
            subtotal: it.subtotal,
          })),
        },
      },
      include: {
        itens: true,
        cliente: true,
      },
    });

    return this.mapearParaDominio(o);
  }

  async listar(filtros?: FiltrosOrcamento): Promise<Orcamento[]> {
    const where: Record<string, unknown> = {};

    if (filtros?.status) {
      where.status = filtros.status;
    }
    if (filtros?.vendedorId) {
      where.vendedorId = filtros.vendedorId;
    }
    if (filtros?.clienteId) {
      where.clienteId = filtros.clienteId;
    }

    const orcamentos = await prisma.orcamento.findMany({
      where,
      include: {
        itens: true,
        cliente: true,
      },
      orderBy: { criadoEm: 'desc' },
    });

    return orcamentos.map((o) => this.mapearParaDominio(o));
  }

  async buscarPorId(id: string): Promise<Orcamento | null> {
    const o = await prisma.orcamento.findUnique({
      where: { id },
      include: {
        itens: true,
        cliente: true,
      },
    });
    return o ? this.mapearParaDominio(o) : null;
  }

  async buscarPorNumero(numeroOrcamento: string): Promise<Orcamento | null> {
    const o = await prisma.orcamento.findUnique({
      where: { numeroOrcamento },
      include: {
        itens: true,
        cliente: true,
      },
    });
    return o ? this.mapearParaDominio(o) : null;
  }

  async atualizarStatus(id: string, status: StatusOrcamento): Promise<Orcamento | null> {
    try {
      const o = await prisma.orcamento.update({
        where: { id },
        data: { status },
        include: {
          itens: true,
          cliente: true,
        },
      });
      return this.mapearParaDominio(o);
    } catch {
      return null;
    }
  }

  async gerarProximoNumero(): Promise<string> {
    const ultimo = await prisma.orcamento.findFirst({
      orderBy: { numeroOrcamento: 'desc' },
    });
    if (!ultimo || isNaN(Number(ultimo.numeroOrcamento))) {
      return '00100';
    }
    const proximoNum = Number(ultimo.numeroOrcamento) + 1;
    return String(proximoNum).padStart(5, '0');
  }
}
