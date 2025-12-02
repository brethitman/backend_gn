//error.middleware.ts
import type { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
  code?: string;
}

export function manejadorErrores(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  // Convertimos err a AppError si tiene la forma correcta
  const error = err as AppError;

  const estado = typeof error.status === "number" ? error.status : 500;

  res.status(estado).json({
    ok: false,
    mensaje: error.message || "Error interno del servidor",
    code: error.code,
  });
}
