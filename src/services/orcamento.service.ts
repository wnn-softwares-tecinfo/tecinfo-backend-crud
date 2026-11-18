import { OrcamentoRepository, FiltrosOrcamento } from '../repositories/orcamento.repository';
import { ClienteRepository } from '../repositories/cliente.repository';
import { ProdutoRepository } from '../repositories/produto.repository';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { CriarOrcamentoDTO, RespostaImpressaoOrcamentoDTO } from '../dtos/orcamento.dto';
import { ItemOrcamento, Orcamento, StatusOrcamento } from '../models/orcamento.model';
import { AppError } from '../utils/AppError';

export class OrcamentoService {
  constructor(
    private orcamentoRepository: OrcamentoRepository,
    private clienteRepository: ClienteRepository,
    private produtoRepository: ProdutoRepository,
    private usuarioRepository: UsuarioRepository
  ) {}

  async criar(dados: CriarOrcamentoDTO): Promise<Orcamento> {
    if (!dados.itens || dados.itens.length === 0) {
      throw new AppError('O orçamento deve conter ao menos um produto.', 400);
    }

    // 1. Validar Vendedor
    const vendedor = await this.usuarioRepository.buscarPorId(dados.vendedorId);
    if (!vendedor) {
      throw new AppError('Vendedor informado não foi encontrado.', 404);
    }

    // 2. Validar Cliente
    const cliente = await this.clienteRepository.buscarPorId(dados.clienteId);
    if (!cliente) {
      throw new AppError('Cliente informado não foi encontrado.', 404);
    }

    // 3. Processar e Calcular Itens
    const itensProcessados: ItemOrcamento[] = [];
    let somaTotalItens = 0;

    for (const itemDto of dados.itens) {
      if (itemDto.quantidade <= 0) {
        throw new AppError('A quantidade do item deve ser maior que zero.', 400);
      }

      const produto = await this.produtoRepository.buscarPorId(itemDto.produtoId);
      if (!produto) {
        throw new AppError(`Produto com ID ${itemDto.produtoId} não encontrado.`, 404);
      }

      // Se não informado valorUnitario, usa o precoVenda cadastrado
      const valorUnitario = itemDto.valorUnitario !== undefined ? Number(itemDto.valorUnitario) : produto.precoVenda;
      const subtotal = Number((valorUnitario * itemDto.quantidade).toFixed(2));
      somaTotalItens += subtotal;

      itensProcessados.push({
        id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        orcamentoId: '', // Preenchido na gravação
        produtoId: produto.id,
        codigoProduto: produto.codigo,
        nomeProduto: produto.nomeProduto,
        quantidade: itemDto.quantidade,
        valorUnitario,
        subtotal,
      });
    }

    // 4. Calcular Valor Total conforme Forma de Pagamento
    let valorFinal = somaTotalItens;
    let parcelas = dados.numeroParcelas;
    let desconto = dados.percentualDesconto;

    if (dados.formaPagamento === 'PARCELADO') {
      parcelas = dados.numeroParcelas || 1;
      if (parcelas < 1 || parcelas > 10) {
        throw new AppError('O parcelamento deve ser entre 1x e 10x conforme limites comerciais.', 400);
      }
    } else if (dados.formaPagamento === 'COM_DESCONTO') {
      desconto = dados.percentualDesconto || 0;
      if (desconto < 0 || desconto > 100) {
        throw new AppError('O percentual de desconto deve estar entre 0% e 100%.', 400);
      }
      valorFinal = somaTotalItens * (1 - desconto / 100);
    } else {
      // À VISTA
      parcelas = undefined;
      desconto = undefined;
    }

    valorFinal = Number(valorFinal.toFixed(2));
    const numeroOrcamento = await this.orcamentoRepository.gerarProximoNumero();

    // 5. Salvar Orçamento
    const novoOrcamento = await this.orcamentoRepository.criar({
      numeroOrcamento,
      vendedorId: vendedor.id,
      vendedorNome: vendedor.nome,
      clienteId: cliente.id,
      clienteNome: cliente.nomeCliente,
      clienteTelefone: cliente.telefone,
      clienteEndereco: {
        rua: cliente.rua,
        numero: cliente.numero,
        complemento: cliente.complemento,
        bairro: cliente.bairro,
        cidade: cliente.cidade,
        cep: cliente.cep,
        pontoReferencia: cliente.pontoReferencia,
      },
      formaPagamento: dados.formaPagamento,
      numeroParcelas: parcelas,
      percentualDesconto: desconto,
      observacoes: dados.observacoes?.trim() || undefined,
      valorTotal: valorFinal,
      status: 'PENDENTE',
      itens: itensProcessados,
    });

    return novoOrcamento;
  }

  async listar(filtros?: FiltrosOrcamento): Promise<Orcamento[]> {
    return this.orcamentoRepository.listar(filtros);
  }

  async buscarPorId(id: string): Promise<Orcamento> {
    const orcamento = await this.orcamentoRepository.buscarPorId(id);
    if (!orcamento) {
      throw new AppError('Orçamento não encontrado.', 404);
    }
    return orcamento;
  }

  async atualizarStatus(id: string, status: StatusOrcamento): Promise<Orcamento> {
    const orcamento = await this.orcamentoRepository.buscarPorId(id);
    if (!orcamento) {
      throw new AppError('Orçamento não encontrado para alteração de status.', 404);
    }

    const atualizado = await this.orcamentoRepository.atualizarStatus(id, status);
    return atualizado!;
  }

  async gerarPayloadImpressao(id: string): Promise<RespostaImpressaoOrcamentoDTO> {
    const orcamento = await this.buscarPorId(id);

    // Formatação amigável da forma de pagamento
    let formaPgtoDescricao = 'À vista - Preço normal';
    if (orcamento.formaPagamento === 'PARCELADO') {
      formaPgtoDescricao = `Parcelado em ${orcamento.numeroParcelas || 1}x sem juros`;
    } else if (orcamento.formaPagamento === 'COM_DESCONTO') {
      formaPgtoDescricao = `À vista com ${orcamento.percentualDesconto || 0}% de desconto aplicado`;
    }

    // Formatação de data/hora (dd/mm/aaaa hh:mm)
    const dataCriacao = new Date(orcamento.criadoEm);
    const dataHoraFormatada = dataCriacao.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      cabecalho: {
        empresa: 'MR - MATERIAL DE CONSTRUÇÃO',
        slogan: 'Um jeito fácil de construir barato',
        titulo: 'ORÇAMENTO',
      },
      dadosGerais: {
        numeroOrcamento: orcamento.numeroOrcamento,
        dataHora: dataHoraFormatada,
        vendedor: orcamento.vendedorNome,
        status: orcamento.status,
      },
      cliente: {
        nome: orcamento.clienteNome,
        telefone: orcamento.clienteTelefone || '',
        rua: orcamento.clienteEndereco?.rua || '',
        numero: orcamento.clienteEndereco?.numero || '',
        complemento: orcamento.clienteEndereco?.complemento,
        bairro: orcamento.clienteEndereco?.bairro || '',
        cidade: orcamento.clienteEndereco?.cidade || '',
        pontoReferencia: orcamento.clienteEndereco?.pontoReferencia,
      },
      itens: orcamento.itens.map((item) => ({
        codigo: item.codigoProduto,
        nomeProduto: item.nomeProduto,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        subtotal: item.subtotal,
      })),
      totais: {
        valorTotal: orcamento.valorTotal,
        valorTotalFormatado: `R$ ${orcamento.valorTotal.toFixed(2).replace('.', ',')}`,
        formaPagamentoDescricao: formaPgtoDescricao,
        observacoes: orcamento.observacoes,
      },
    };
  }
}
