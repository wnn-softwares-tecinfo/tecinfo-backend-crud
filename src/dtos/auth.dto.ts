import { CargoUsuario } from '../models/usuario.model';

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  cargo: CargoUsuario;
}

export interface RespostaLoginDTO {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    cargo: CargoUsuario;
  };
}
