"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comentarios_controller_1 = require("../controllers/comentarios.controller");
const router = (0, express_1.Router)();
// GET comentarios de un tópico
router.get("/topicos/:idTopico/comentarios", comentarios_controller_1.obtenerComentariosTopico);
// POST comentario principal
router.post("/topicos/:idTopico/comentarios", comentarios_controller_1.crearComentarioTopico);
// POST respuesta
router.post("/comentarios/:idComentario/respuestas", comentarios_controller_1.crearRespuestaComentario);
exports.default = router;
//# sourceMappingURL=comentarios.routes.js.map