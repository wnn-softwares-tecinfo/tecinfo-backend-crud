export type CargoUsuario = 'ADMIN' | 'VENDEDOR';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  cargo: CargoUsuario;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm?: Date;
}
