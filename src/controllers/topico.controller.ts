// topicos.controller.ts
import { Request, Response } from "express";

import { insertarTopicoDespuesDe } from "../repositories/topico.repo";
import {
  listarTopicos,
  buscarTopicoPorId,
  crearTopico,
  actualizarTopico,
  Topico,
} from "../repositories/topico.repo";

export async function obtenerTopicos(req: Request, res: Response) {
  try {
    const topicos = await listarTopicos();
    return res.json({ ok: true, topicos });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener tópicos" });
  }
}

export async function obtenerTopicoPorId(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ ok: false, mensaje: "ID de tópico es requerido" });
    }

    const topico = await buscarTopicoPorId(id);
    if (!topico) {
      return res.status(404).json({ ok: false, mensaje: "Tópico no encontrado" });
    }

    return res.json({ ok: true, topico });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener el tópico" });
  }
}

export async function crearTopicoController(req: Request, res: Response) {
  try {
    const { idCurso, titulo, contenido, orden } = req.body;
    if (!idCurso || !titulo) {
      return res.status(400).json({ ok: false, mensaje: "idCurso y titulo son requeridos" });
    }

    const nuevoTopico: Topico = await crearTopico({ idCurso, titulo, contenido, orden });
    return res.status(201).json({ ok: true, mensaje: "Tópico creado", topico: nuevoTopico });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensaje: "Error al crear el tópico" });
  }
}

export async function actualizarTopicoController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { titulo, contenido, orden } = req.body;

    if (!id) {
      return res.status(400).json({ ok: false, mensaje: "ID de tópico es requerido" });
    }

    const topicoActualizado = await actualizarTopico({ id, titulo, contenido, orden });
    if (!topicoActualizado) {
      return res.status(404).json({ ok: false, mensaje: "Tópico no encontrado o sin cambios" });
    }

    return res.json({ ok: true, mensaje: "Tópico actualizado", topico: topicoActualizado });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensaje: "Error al actualizar el tópico" });
  }
}


export async function insertarTopicoDespuesDeController(req: Request, res: Response) {
  try {
    const { idCurso, titulo, contenido, afterTopicoId } = req.body;

    if (!idCurso || !titulo) {
      return res.status(400).json({ ok: false, mensaje: "idCurso y titulo son requeridos" });
    }

    const nuevoTopico = await insertarTopicoDespuesDe({
      idCurso,
      titulo,
      contenido,
      afterTopicoId,
    });

    return res.status(201).json({
      ok: true,
      mensaje: "Tópico insertado correctamente",
      topico: nuevoTopico,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, mensaje: "Error al insertar el tópico" });
  }
}

