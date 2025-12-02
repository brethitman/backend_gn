//C:\Users\Ffcg\Music\main de main\google\GENERACION-DE-SOFTWARE\BACKEND_GS\src\controllers\autenticacion.controller.ts
import type { Request, Response, NextFunction } from "express";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { 
  verificarUsuario, 
  obtenerUsuarioPorId, 
  marcarUsuarioComoVerificado 
} from "../repositories/autenticacion.repo";
import { CodigoVerificacionService } from "../services/codigo-verificacion.service";

// Tipamos el secreto como Secret de jsonwebtoken
const JWT_SECRETO: Secret = (process.env.JWT_SECRETO ?? "secreto_dev") as Secret;

// Con exactOptionalPropertyTypes: true, nos aseguramos de que NUNCA sea undefined
type ExpiresIn = NonNullable<SignOptions["expiresIn"]>;
const JWT_EXPIRES: ExpiresIn = ((process.env.JWT_EXPIRES as ExpiresIn) ?? "8h") as ExpiresIn;


const codigoVerificacionService = new CodigoVerificacionService();


/**
 * POST /api/v1/autenticacion/login
 * Body: { correo: string, contrasena: string }
 */
export async function iniciarSesion(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const correo = (req.body?.correo ?? "").trim();
    const contrasena = req.body?.contrasena ?? "";

    if (!correo || !contrasena) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "Faltan el correo o la contraseña." });
    }

    // Debe usar bcrypt.compare dentro del repo y devolver null si no coincide
    const usuario = await verificarUsuario(correo, contrasena);

    if (!usuario) {
      return res
        .status(401)
        .json({ ok: false, mensaje: "Credenciales inválidas." });
    }

    if (usuario.activo === false) {
      return res.status(403).json({ ok: false, mensaje: "Usuario inactivo." });
    }


    // 🔐 VERIFICACIÓN: Si el usuario no está verificado, enviar código
    if (!usuario.verificado) {
      await codigoVerificacionService.enviarCodigoVerificacion(
        usuario.correo,
        usuario.nombre_completo,
        usuario.id_usuario
      );

      return res.status(200).json({
        ok: true,
        mensaje: "Código de verificación enviado a tu correo",
        requiereVerificacion: true,
        usuarioId: usuario.id_usuario
      });
    }

    // ✅ Usuario verificado - proceder con login normal

    const payload = {
      sub: String(usuario.id_usuario),
      rol: usuario.rol,
      correo: usuario.correo,
    };


    const token = jwt.sign(payload, JWT_SECRETO, { expiresIn: JWT_EXPIRES });

    return res.status(200).json({
      ok: true,
      mensaje: "Inicio de sesión exitoso",
      datos: {
        usuario: {
          id: String(usuario.id_usuario),
          nombre: usuario.nombre_completo,
          correo: usuario.correo,
          rol: usuario.rol,
        },
        token,
      },
    });
  } catch (err: unknown) {
    return next(err);
  }
}

/**
 * POST /api/v1/autenticacion/verificar-codigo
 * Body: { usuarioId: number, codigo: string }
 */
export async function verificarCodigo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { usuarioId, codigo } = req.body;

    if (!usuarioId || !codigo) {
      return res.status(400).json({
        ok: false,
        mensaje: "Faltan el ID de usuario o el código"
      });
    }

    const esValido = await codigoVerificacionService.verificarCodigo(codigo, usuarioId);
    
    if (!esValido) {
      return res.status(400).json({
        ok: false,
        mensaje: "Código inválido o expirado"
      });
    }

    // Marcar usuario como verificado en la base de datos
    await marcarUsuarioComoVerificado(usuarioId);

    return res.status(200).json({
      ok: true,
      mensaje: "Correo verificado exitosamente"
    });

  } catch (err: unknown) {
    return next(err);
  }
}

/**
 * POST /api/v1/autenticacion/reenviar-codigo
 * Body: { usuarioId: number }
 */
export async function reenviarCodigo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({
        ok: false,
        mensaje: "Falta el ID de usuario"
      });
    }

    const usuario = await obtenerUsuarioPorId(usuarioId);
    
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: "Usuario no encontrado"
      });
    }

    await codigoVerificacionService.enviarCodigoVerificacion(
      usuario.correo,
      usuario.nombre_completo,
      usuario.id_usuario
    );

    return res.status(200).json({
      ok: true,
      mensaje: "Código reenviado exitosamente"
    });

  } catch (err: unknown) {
    return next(err);
  }
}
