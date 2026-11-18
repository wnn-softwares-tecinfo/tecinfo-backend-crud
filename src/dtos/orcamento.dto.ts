import { FormaPagamento, StatusOrcamento } from '../models/orcamento.model';

export interface CriarItemOrcamentoDTO {
  produtoId: string;
  quantidade: number;
  valorUnitario?: number; // Se não fornecido, busca o precoVenda do cadastro
}

export interface CriarOrcamentoDTO {
  vendedorId: string;
  clienteId: string;
  formaPagamento: FormaPagamento;
  numeroParcelas?: number;
  percentualDesconto?: number;
  observacoes?: string;
  itens: CriarItemOrcamentoDTO[];
}

export interface AtualizarStatusOrcamentoDTO {
  status: StatusOrcamento;
}

export interface RespostaImpressaoOrcamentoDTO {
  cabecalho: {
    empresa: string;
    slogan: string;
    titulo: string;
  };
  dadosGerais: {
    numeroOrcamento: string;
    dataHora: string;
    vendedor: string;
    status: StatusOrcamento;
  };
  cliente: {
    nome: string;
    telefone: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    pontoReferencia?: string;
  };
  itens: Array<{
    codigo: string;
    nomeProduto: string;
    quantidade: number;
    valorUnitario: number;
    subtotal: number;
  }>;
  totais: {
    valorTotal: number;
    valorTotalFormatado: string;
    formaPagamentoDescricao: string;
    observacoes?: string;
  };
}
