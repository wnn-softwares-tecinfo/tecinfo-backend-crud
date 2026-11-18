export interface Cliente {
  id: string;
  nomeCliente: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  cep: string;
  pontoReferencia?: string;
  criadoEm: Date;
  atualizadoEm?: Date;
}
