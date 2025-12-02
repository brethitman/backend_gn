import { Request, Response } from "express";

import { listarUsuarios, actualizarUsuario } from "../repositories/usuarios.repo";

export async function obtenerUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await listarUsuarios();
    return res.json({ ok: true, usuarios });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener usuarios" });
  }
}
export async function actualizarUsuarioController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nombre, correo, rol, activo } = req.body;

    if (!id) {
      return res.status(400).json({ ok: false, mensaje: "ID de usuario es requerido" });
    }
    
    const usuarioActualizado = await actualizarUsuario({ id, nombre, correo, rol, activo });
    if (!usuarioActualizado) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado o sin cambios" });
    }

    return res.json({ ok: true, mensaje: "Usuario actualizado", usuario: usuarioActualizado });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar usuario" });
  }
}