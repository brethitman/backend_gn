import { Request, Response } from "express";

import {
  listarCursos,
  buscarCursoPorId,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  buscarCursoConTopicos,
} from "../repositories/cursos.repo";

/* 🔹 Listar todos los cursos */
export async function obtenerCursos(req: Request, res: Response) {
  try {
    const cursos = await listarCursos();
    if (cursos.length === 0) {
      return res.json({ ok: false, mensaje: "No existen cursos" });
    }
    return res.json({ ok: true, cursos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, mensaje: "Error al listar cursos" });
  }
}

/* 🔹 Obtener curso por ID */
export async function obtenerCursoPorId(req: Request, res: Response) {
  try {
    const id = req.params.id as string; // ✅ conversión segura
    const curso = await buscarCursoPorId(id);
    if (!curso) {
      return res.status(404).json({ ok: false, mensaje: "Curso no encontrado" });
    }
    res.json({ ok: true, curso });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, mensaje: "Error al obtener curso" });
  }
}

/* 🔹 Crear curso */
export async function crearCursoController(req: Request, res: Response) {
  try {
    const { titulo, descripcion, publicado, creadoDesdeId } = req.body;
    if (!titulo) {
      return res.status(400).json({ ok: false, mensaje: "El título es requerido" });
    }

    const nuevo = await crearCurso({
      titulo,
      descripcion: descripcion ?? null,
      publicado: publicado ?? false,
      creadoDesdeId: creadoDesdeId ?? null,
    });

    res.status(201).json({ ok: true, mensaje: "Curso creado", curso: nuevo });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, mensaje: "Error al crear curso" });
  }
}

/* 🔹 Actualizar curso */
export async function actualizarCursoController(req: Request, res: Response) {
  try {
    const id = req.params.id as string; // ✅ conversión segura
    const { titulo, descripcion, publicado } = req.body;

    const actualizado = await actualizarCurso({
      id,
      titulo,
      descripcion,
      publicado,
    });

    if (!actualizado) {
      return res
        .status(404)
        .json({ ok: false, mensaje: "Curso no encontrado o sin cambios" });
    }

    res.json({ ok: true, mensaje: "Curso actualizado", curso: actualizado });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, mensaje: "Error al actualizar curso" });
  }
}

/* 🔹 Eliminar curso */
export async function eliminarCursoController(req: Request, res: Response) {
  try {
    const id = req.params.id as string; // ✅ conversión segura
    const eliminado = await eliminarCurso(id);
    if (!eliminado) {
      return res.status(404).json({ ok: false, mensaje: "Curso no encontrado" });
    }
    res.json({ ok: true, mensaje: "Curso eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, mensaje: "Error al eliminar curso" });
  }
}

/* 🔹 Obtener curso con tópicos */
export async function obtenerCursoConTopicos(req: Request, res: Response) {
  try {
    const id = req.params.id as string; // ✅ conversión segura
    const curso = await buscarCursoConTopicos(id);

    if (!curso) {
      return res.status(404).json({ ok: false, mensaje: "No existen cursos" });
    }

    if (!curso.topicos || curso.topicos.length === 0) {
      return res.json({
        ok: false,
        mensaje: "No existen tópicos",
        curso: { ...curso, topicos: [] },
      });
    }

    res.json({ ok: true, curso });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, mensaje: "Error al obtener curso con tópicos" });
  }
}
