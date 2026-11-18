export interface Produto {
  id: string;
  codigoBarras: string;
  codigo: string; // Ex: "00085", "00194", "02939"
  nomeProduto: string;
  marca: string;
  familia: string; // Elétrico, Hidráulico, Alvenaria, Ferramentas, Pintura...
  fornecedor: string;
  custo: number;
  promocional: boolean;
  precoVenda: number;
  descontoAvista: number;
  precoPrazo: number;
  taxaLucro: number; // % 0 a 100
  estoqueMinimo: number;
  estoqueAtual: number;
  unidade: string; // Litro, Quilo, Caixa, Metro, Cartela, Par, Saco, Unidade...
  validade?: Date;
  garantia?: string;
  criadoEm: Date;
  atualizadoEm?: Date;
}
