// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDevelopment = config.env === 'development';
  
  // Log error details
  console.error('ERROR:', err);
  
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(isDevelopment && { 
        stack: err.stack,
        path: req.path,
        method: req.method
      }),
    });
    return;
  }

  // Handle specific error types
  const statusCode = (err as any).statusCode || 500;
  const message = isDevelopment ? err.message : 'Internal server error';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(isDevelopment && { 
      stack: err.stack,
      path: req.path,
      method: req.method,
      error: err
    }),
  });
};
