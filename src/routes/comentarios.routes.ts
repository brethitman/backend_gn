import { Router } from "express";

import {
  obtenerComentariosTopico,
  crearComentarioTopico,
  crearRespuestaComentario,
} from "../controllers/comentarios.controller";

const router = Router();

// GET comentarios de un tópico
router.get("/topicos/:idTopico/comentarios", obtenerComentariosTopico);

// POST comentario principal
router.post("/topicos/:idTopico/comentarios", crearComentarioTopico);

// POST respuesta
router.post("/comentarios/:idComentario/respuestas", crearRespuestaComentario);

export default router;
