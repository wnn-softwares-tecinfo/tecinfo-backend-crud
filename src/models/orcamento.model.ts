export type FormaPagamento = 'A_VISTA' | 'PARCELADO' | 'COM_DESCONTO';
export type StatusOrcamento = 'PENDENTE' | 'APROVADO' | 'CANCELADO';

export interface ItemOrcamento {
  id: string;
  orcamentoId: string;
  produtoId: string;
  codigoProduto: string; // Ex: "00085"
  nomeProduto: string;
  quantidade: number;
  valorUnitario: number;
  subtotal: number;
}

export interface Orcamento {
  id: string;
  numeroOrcamento: string; // Ex: "00124"
  vendedorId: string;
  vendedorNome: string;
  clienteId: string;
  clienteNome: string;
  clienteTelefone?: string;
  clienteEndereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    cep: string;
    pontoReferencia?: string;
  };
  formaPagamento: FormaPagamento;
  numeroParcelas?: number; // 1 a 10
  percentualDesconto?: number; // %
  observacoes?: string;
  valorTotal: number;
  status: StatusOrcamento;
  itens: ItemOrcamento[];
  criadoEm: Date;
  atualizadoEm?: Date;
}
