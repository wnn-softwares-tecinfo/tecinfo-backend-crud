import { ProdutoRepository, FiltrosProduto } from '../repositories/produto.repository';
import { CriarProdutoDTO, AtualizarProdutoDTO, AtualizarEstoqueDTO } from '../dtos/produto.dto';
import { Produto } from '../models/produto.model';
import { AppError } from '../utils/AppError';

export class ProdutoService {
  constructor(private produtoRepository: ProdutoRepository) {}

  async criar(dados: CriarProdutoDTO): Promise<Produto> {
    if (!dados.nomeProduto?.trim()) {
      throw new AppError('O Nome do Produto é obrigatório.', 400);
    }

    if (!dados.codigoBarras?.trim()) {
      throw new AppError('O Código de Barras é obrigatório.', 400);
    }

    const jaExisteCodigoBarras = await this.produtoRepository.buscarPorCodigoBarras(dados.codigoBarras);
    if (jaExisteCodigoBarras) {
      throw new AppError('Já existe um produto com este código de barras.', 400);
    }

    if (dados.codigo) {
      const jaExisteCodigo = await this.produtoRepository.buscarPorCodigo(dados.codigo);
      if (jaExisteCodigo) {
        throw new AppError('Já existe um produto cadastrado com este código.', 400);
      }
    }

    if (dados.custo < 0 || dados.precoVenda < 0) {
      throw new AppError('Custo e Preço de Venda não podem ser negativos.', 400);
    }

    const codigo = dados.codigo || (await this.produtoRepository.gerarProximoCodigo());

    return this.produtoRepository.criar({
      codigoBarras: dados.codigoBarras.trim(),
      codigo,
      nomeProduto: dados.nomeProduto.trim(),
      marca: dados.marca?.trim() || 'Geral',
      familia: dados.familia?.trim() || 'Geral',
      fornecedor: dados.fornecedor?.trim() || 'Geral',
      custo: Number(dados.custo),
      promocional: Boolean(dados.promocional),
      precoVenda: Number(dados.precoVenda),
      descontoAvista: dados.descontoAvista ? Number(dados.descontoAvista) : 0,
      precoPrazo: dados.precoPrazo ? Number(dados.precoPrazo) : Number(dados.precoVenda),
      taxaLucro: Number(dados.taxaLucro || 0),
      estoqueMinimo: Number(dados.estoqueMinimo || 5),
      estoqueAtual: Number(dados.estoqueAtual || 0),
      unidade: dados.unidade?.trim() || 'Unidade',
      validade: dados.validade ? new Date(dados.validade) : undefined,
      garantia: dados.garantia?.trim() || undefined,
    });
  }

  async listar(filtros?: FiltrosProduto): Promise<Produto[]> {
    return this.produtoRepository.listar(filtros);
  }

  async buscarPorId(id: string): Promise<Produto> {
    const produto = await this.produtoRepository.buscarPorId(id);
    if (!produto) {
      throw new AppError('Produto não encontrado.', 404);
    }
    return produto;
  }

  async buscarPorCodigo(codigo: string): Promise<Produto> {
    const produto = await this.produtoRepository.buscarPorCodigo(codigo);
    if (!produto) {
      throw new AppError(`Produto com código ${codigo} não encontrado.`, 404);
    }
    return produto;
  }

  async atualizar(id: string, dados: AtualizarProdutoDTO): Promise<Produto> {
    const produtoExistente = await this.produtoRepository.buscarPorId(id);
    if (!produtoExistente) {
      throw new AppError('Produto não encontrado para atualização.', 404);
    }

    const { validade, ...resto } = dados;
    const payload: Partial<Omit<Produto, 'id' | 'criadoEm'>> = {
      ...resto,
      ...(validade ? { validade: new Date(validade) } : {}),
    };

    const atualizado = await this.produtoRepository.atualizar(id, payload);
    if (!atualizado) {
      throw new AppError('Falha ao atualizar o produto.', 500);
    }

    return atualizado;
  }

  async movimentarEstoque(id: string, { quantidadeDelta }: AtualizarEstoqueDTO): Promise<Produto> {
    const produto = await this.produtoRepository.buscarPorId(id);
    if (!produto) {
      throw new AppError('Produto não encontrado para movimentação de estoque.', 404);
    }

    if (produto.estoqueAtual + quantidadeDelta < 0) {
      throw new AppError(
        `Estoque insuficiente. Saldo atual: ${produto.estoqueAtual}, tentativa de baixa: ${Math.abs(quantidadeDelta)}.`,
        400
      );
    }

    const atualizado = await this.produtoRepository.atualizarEstoque(id, quantidadeDelta);
    return atualizado!;
  }

  async excluir(id: string): Promise<void> {
    const produto = await this.produtoRepository.buscarPorId(id);
    if (!produto) {
      throw new AppError('Produto não encontrado.', 404);
    }

    const sucesso = await this.produtoRepository.excluir(id);
    if (!sucesso) {
      throw new AppError('Não foi possível excluir o produto.', 500);
    }
  }

  listarFamiliasDisponiveis(): string[] {
    return [
      'Alvenaria',
      'Elétrico',
      'Hidráulico',
      'Pintura e Acabamento',
      'Ferramentas',
      'Pisos e Revestimentos',
      'Iluminação',
      'Ferragens',
    ];
  }

  listarUnidadesDisponiveis(): string[] {
    return [
      'Unidade',
      'Saco',
      'Metro',
      'Quilo',
      'Litro',
      'Caixa',
      'Cartela',
      'Par',
      'Barra',
    ];
  }
}
