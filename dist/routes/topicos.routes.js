"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topico_controller_1 = require("../controllers/topico.controller");
const router = (0, express_1.Router)();
router.get("/", topico_controller_1.obtenerTopicos); // GET /topicos -> lista todos los tópicos
// Obtener un tópico por ID
router.get("/:id", topico_controller_1.obtenerTopicoPorId);
// Crear un nuevo tópico
router.post("/", topico_controller_1.crearTopicoController);
// Actualizar un tópico existente
router.put("/:id", topico_controller_1.actualizarTopicoController);
router.post("/insertar-despues", topico_controller_1.insertarTopicoDespuesDeController);
exports.default = router;
//# sourceMappingURL=topicos.routes.js.map