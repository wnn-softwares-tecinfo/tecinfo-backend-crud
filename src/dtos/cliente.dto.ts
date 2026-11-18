export interface CriarClienteDTO {
  nomeCliente: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  cep: string;
  pontoReferencia?: string;
}

export interface AtualizarClienteDTO {
  nomeCliente?: string;
  telefone?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  pontoReferencia?: string;
}
