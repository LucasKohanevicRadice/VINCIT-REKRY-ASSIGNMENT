import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/customErrors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    const response: { code: string; message: string; details?: unknown } = {
      code: err.code,
      message: err.message
    };

    if (err.details) {
      response.details = err.details;
    }

    res.status(err.statusCode).json({ error: response });
    return;
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}
