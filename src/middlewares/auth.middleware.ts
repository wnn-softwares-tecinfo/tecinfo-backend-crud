import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { CargoUsuario } from '../models/usuario.model';

interface TokenPayload {
  id: string;
  email: string;
  cargo: CargoUsuario;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token de autenticação não fornecido.', 401);
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    throw new AppError('Formato do token inválido. Esperado Bearer <TOKEN>.', 401);
  }

  try {
    const secret = process.env.JWT_SECRET || 'mr_construcao_secret_key_super_segura_tecinfo_2026';
    const decoded = jwt.verify(token, secret) as TokenPayload;

    req.usuario = {
      id: decoded.id,
      email: decoded.email,
      cargo: decoded.cargo,
    };

    return next();
  } catch {
    throw new AppError('Token inválido ou expirado.', 401);
  }
}

export function requireRole(allowedRoles: CargoUsuario[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      throw new AppError('Usuário não autenticado.', 401);
    }

    if (!allowedRoles.includes(req.usuario.cargo)) {
      throw new AppError('Acesso não autorizado para o cargo do usuário.', 403);
    }

    return next();
  };
}
