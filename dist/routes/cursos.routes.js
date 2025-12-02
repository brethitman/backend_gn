"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cursos_controller_1 = require("../controllers/cursos.controller");
const router = (0, express_1.Router)();
// CRUD básico
router.get("/", cursos_controller_1.obtenerCursos);
router.get("/:id", cursos_controller_1.obtenerCursoPorId);
router.post("/", cursos_controller_1.crearCursoController);
router.put("/:id", cursos_controller_1.actualizarCursoController);
router.delete("/:id", cursos_controller_1.eliminarCursoController);
// Curso con sus tópicos
router.get("/:id/topicos", cursos_controller_1.obtenerCursoConTopicos);
exports.default = router;
//# sourceMappingURL=cursos.routes.js.map