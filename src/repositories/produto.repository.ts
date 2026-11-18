import { prisma } from '../config/database';
import { Produto } from '../models/produto.model';
import { Produto as ProdutoPrisma } from '@prisma/client';

export interface FiltrosProduto {
  busca?: string;
  familia?: string;
  promocional?: boolean;
}

export class ProdutoRepository {
  private mapearParaDominio(p: ProdutoPrisma): Produto {
    return {
      id: p.id,
      codigoBarras: p.codigoBarras,
      codigo: p.codigo,
      nomeProduto: p.nomeProduto,
      marca: p.marca,
      familia: p.familia,
      fornecedor: p.fornecedor,
      custo: Number(p.custo),
      promocional: p.promocional,
      precoVenda: Number(p.precoVenda),
      descontoAvista: Number(p.descontoAvista),
      precoPrazo: Number(p.precoPrazo),
      taxaLucro: Number(p.taxaLucro),
      estoqueMinimo: p.estoqueMinimo,
      estoqueAtual: p.estoqueAtual,
      unidade: p.unidade,
      validade: p.validade || undefined,
      garantia: p.garantia || undefined,
      criadoEm: p.criadoEm,
      atualizadoEm: p.atualizadoEm,
    };
  }

  async criar(dados: Omit<Produto, 'id' | 'criadoEm'>): Promise<Produto> {
    const p = await prisma.produto.create({
      data: {
        codigoBarras: dados.codigoBarras,
        codigo: dados.codigo,
        nomeProduto: dados.nomeProduto,
        marca: dados.marca,
        familia: dados.familia,
        fornecedor: dados.fornecedor,
        custo: dados.custo,
        promocional: dados.promocional,
        precoVenda: dados.precoVenda,
        descontoAvista: dados.descontoAvista,
        precoPrazo: dados.precoPrazo,
        taxaLucro: dados.taxaLucro,
        estoqueMinimo: dados.estoqueMinimo,
        estoqueAtual: dados.estoqueAtual,
        unidade: dados.unidade,
        validade: dados.validade,
        garantia: dados.garantia,
      },
    });
    return this.mapearParaDominio(p);
  }

  async listar(filtros?: FiltrosProduto): Promise<Produto[]> {
    const where: Record<string, unknown> = {};

    if (filtros?.busca) {
      const termo = filtros.busca.trim();
      where.OR = [
        { nomeProduto: { contains: termo, mode: 'insensitive' } },
        { codigo: { contains: termo, mode: 'insensitive' } },
        { codigoBarras: { contains: termo, mode: 'insensitive' } },
      ];
    }

    if (filtros?.familia) {
      where.familia = { equals: filtros.familia, mode: 'insensitive' };
    }

    if (filtros?.promocional !== undefined) {
      where.promocional = filtros.promocional;
    }

    const produtos = await prisma.produto.findMany({
      where,
      orderBy: { nomeProduto: 'asc' },
    });

    return produtos.map((p) => this.mapearParaDominio(p));
  }

  async buscarPorId(id: string): Promise<Produto | null> {
    const p = await prisma.produto.findUnique({
      where: { id },
    });
    return p ? this.mapearParaDominio(p) : null;
  }

  async buscarPorCodigo(codigo: string): Promise<Produto | null> {
    const p = await prisma.produto.findUnique({
      where: { codigo },
    });
    return p ? this.mapearParaDominio(p) : null;
  }

  async buscarPorCodigoBarras(codigoBarras: string): Promise<Produto | null> {
    const p = await prisma.produto.findUnique({
      where: { codigoBarras },
    });
    return p ? this.mapearParaDominio(p) : null;
  }

  async atualizar(
    id: string,
    dados: Partial<Omit<Produto, 'id' | 'criadoEm'>>
  ): Promise<Produto | null> {
    try {
      const p = await prisma.produto.update({
        where: { id },
        data: {
          ...dados,
          custo: dados.custo !== undefined ? dados.custo : undefined,
          precoVenda: dados.precoVenda !== undefined ? dados.precoVenda : undefined,
          descontoAvista: dados.descontoAvista !== undefined ? dados.descontoAvista : undefined,
          precoPrazo: dados.precoPrazo !== undefined ? dados.precoPrazo : undefined,
          taxaLucro: dados.taxaLucro !== undefined ? dados.taxaLucro : undefined,
        },
      });
      return this.mapearParaDominio(p);
    } catch {
      return null;
    }
  }

  async atualizarEstoque(id: string, quantidadeDelta: number): Promise<Produto | null> {
    try {
      const p = await prisma.produto.update({
        where: { id },
        data: {
          estoqueAtual: {
            increment: quantidadeDelta,
          },
        },
      });
      return this.mapearParaDominio(p);
    } catch {
      return null;
    }
  }

  async excluir(id: string): Promise<boolean> {
    try {
      await prisma.produto.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async gerarProximoCodigo(): Promise<string> {
    const ultimoProduto = await prisma.produto.findFirst({
      orderBy: { codigo: 'desc' },
    });
    if (!ultimoProduto || isNaN(Number(ultimoProduto.codigo))) {
      return '00001';
    }
    const proximoNum = Number(ultimoProduto.codigo) + 1;
    return String(proximoNum).padStart(5, '0');
  }
}
