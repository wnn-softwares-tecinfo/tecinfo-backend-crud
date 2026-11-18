export interface CriarProdutoDTO {
  codigoBarras: string;
  codigo?: string; // Opcional: auto-gerado se não fornecido
  nomeProduto: string;
  marca: string;
  familia: string;
  fornecedor: string;
  custo: number;
  promocional?: boolean;
  precoVenda: number;
  descontoAvista?: number;
  precoPrazo: number;
  taxaLucro: number;
  estoqueMinimo?: number;
  estoqueAtual?: number;
  unidade: string;
  validade?: string;
  garantia?: string;
}

export interface AtualizarProdutoDTO {
  codigoBarras?: string;
  codigo?: string;
  nomeProduto?: string;
  marca?: string;
  familia?: string;
  fornecedor?: string;
  custo?: number;
  promocional?: boolean;
  precoVenda?: number;
  descontoAvista?: number;
  precoPrazo?: number;
  taxaLucro?: number;
  estoqueMinimo?: number;
  estoqueAtual?: number;
  unidade?: string;
  validade?: string;
  garantia?: string;
}

export interface AtualizarEstoqueDTO {
  quantidadeDelta: number; // Positivo para entrada, negativo para saída
}
