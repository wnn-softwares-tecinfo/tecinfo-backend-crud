import { CargoUsuario } from '../models/usuario.model';

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: string;
        email: string;
        cargo: CargoUsuario;
      };
    }
  }
}
