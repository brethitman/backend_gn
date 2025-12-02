import { Request, Response } from "express";

import {
  obtenerComentarioPorTopico,
  crearComentarioPrincipal,
  crearRespuesta,
} from "../repositories/comentarios.repo";

// Obtener comentario + respuestas de un tópico
export async function obtenerComentariosTopico(req: Request, res: Response) {
  try {
    const { idTopico } = req.params;

    // Validación obligatoria (evita string | undefined)
    if (!idTopico) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "El idTopico es requerido" });
    }

    const comentario = await obtenerComentarioPorTopico(idTopico);

    return res.json({ ok: true, comentario });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ ok: false, mensaje: "Error al obtener comentarios" });
  }
}

// Crear comentario principal (solo si no existe)
export async function crearComentarioTopico(req: Request, res: Response) {
  try {
    const { idTopico } = req.params;

    // Validación obligatoria (evita string | undefined)
    if (!idTopico) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "El idTopico es requerido" });
    }

    const { idUsuario, texto } = req.body;

    // Puedes agregar validaciones extra si quieres
    if (!idUsuario || !texto) {
      return res.status(400).json({
        ok: false,
        mensaje: "idUsuario y texto son obligatorios",
      });
    }

    const creado = await crearComentarioPrincipal({
      idTopico,
      idUsuario,
      texto,
    });

    return res
      .status(201)
      .json({ ok: true, mensaje: "Comentario creado", creado });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ ok: false, mensaje: "Error al crear comentario" });
  }
}

// Crear respuesta a comentario existente
export async function crearRespuestaComentario(req: Request, res: Response) {
  try {
    const { idComentario } = req.params;

    // Validación obligatoria (evita string | undefined)
    if (!idComentario) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "El idComentario es requerido" });
    }

    const { idUsuario, texto } = req.body;

    if (!idUsuario || !texto) {
      return res.status(400).json({
        ok: false,
        mensaje: "idUsuario y texto son obligatorios",
      });
    }

    const respuesta = await crearRespuesta({
      idComentario,
      idUsuario,
      texto,
    });

    return res
      .status(201)
      .json({ ok: true, mensaje: "Respuesta agregada", respuesta });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ ok: false, mensaje: "Error al crear respuesta" });
  }
}
