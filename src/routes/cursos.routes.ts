import { Router } from "express";

import {
  obtenerCursos,
  obtenerCursoPorId,
  crearCursoController,
  actualizarCursoController,
  eliminarCursoController,
  obtenerCursoConTopicos,
} from "../controllers/cursos.controller";

const router = Router();

// CRUD básico
router.get("/", obtenerCursos);
router.get("/:id", obtenerCursoPorId);
router.post("/", crearCursoController);
router.put("/:id", actualizarCursoController);
router.delete("/:id", eliminarCursoController);

// Curso con sus tópicos
router.get("/:id/topicos", obtenerCursoConTopicos);

export default router;
