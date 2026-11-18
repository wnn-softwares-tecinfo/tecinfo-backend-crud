import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError || (error && typeof (error as any).statusCode === 'number')) {
    const statusCode = (error as any).statusCode || 400;
    res.status(statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  console.error('Erro não tratado na API:', error);

  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor. Tente novamente mais tarde.',
  });
}
