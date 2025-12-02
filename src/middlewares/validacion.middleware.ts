//validacion.middleware.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";


export const RegistroSchema = z.object({
  nombre: z.string().min(3).max(120),
  correo: z.string().email(),
  contrasena: z.string().min(8).max(100),
  rol: z.enum(["docente", "estudiante", "administrador"]).default("estudiante"),
});

export function validarRegistro(req: Request, res: Response, next: NextFunction) {
  const parsed = RegistroSchema.safeParse(req.body);
  if (!parsed.success) {
    const errores = parsed.error.issues.map(i => ({ campo: i.path.join("."), mensaje: i.message }));
    return res.status(400).json({ ok: false, mensaje: "Datos inválidos", errores });
  }
  req.body = parsed.data;
  next();
}
