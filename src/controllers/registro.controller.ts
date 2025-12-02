//C:\Users\Ffcg\Music\main de main\google\GENERACION-DE-SOFTWARE\BACKEND_GS\src\controllers\registro.controller.ts

import bcrypt from "bcryptjs";
import { Request, Response } from "express";


import { buscarPorCorreo, crearUsuario } from "../repositories/usuarios.repo";
import { CodigoVerificacionService } from "../services/codigo-verificacion.service";

const codigoVerificacionService = new CodigoVerificacionService();

export async function registrarUsuario(req: Request, res: Response) {
  try {
    const { nombre, correo, contrasena, rol } = req.body;

    const yaExiste = await buscarPorCorreo(correo);
    if (yaExiste) {
      return res.status(409).json({ ok: false, mensaje: "El correo ya está registrado" });
    }

    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const usuario = await crearUsuario({ nombre, correo, contrasenaHash, rol });


    // ✅ ENVIAR CÓDIGO DE VERIFICACIÓN
    await codigoVerificacionService.enviarCodigoVerificacion(
      usuario.correo,
      usuario.nombre,
      Number(usuario.id)
    );

    // ✅ RESPONDER CON usuarioId PARA LA VERIFICACIÓN
    return res.status(201).json({
      ok: true,
      mensaje: "Registro exitoso. Se ha enviado un código de verificación a tu correo.",
      requiereVerificacion: true,
      usuarioId: Number(usuario.id) // ✅ ESTO ES LO QUE NECESITA EL FRONTEND
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
  }

}
