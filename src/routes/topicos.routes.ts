import { Router } from "express";

import {
  obtenerTopicos,
  obtenerTopicoPorId,
  crearTopicoController,
  actualizarTopicoController,
  insertarTopicoDespuesDeController,
} from "../controllers/topico.controller";

const router = Router();

router.get("/", obtenerTopicos); // GET /topicos -> lista todos los tópicos

// Obtener un tópico por ID
router.get("/:id", obtenerTopicoPorId);

// Crear un nuevo tópico
router.post("/", crearTopicoController);

// Actualizar un tópico existente
router.put("/:id", actualizarTopicoController);

router.post("/insertar-despues", insertarTopicoDespuesDeController);

export default router;
