"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerCursos = obtenerCursos;
exports.obtenerCursoPorId = obtenerCursoPorId;
exports.crearCursoController = crearCursoController;
exports.actualizarCursoController = actualizarCursoController;
exports.eliminarCursoController = eliminarCursoController;
exports.obtenerCursoConTopicos = obtenerCursoConTopicos;
const cursos_repo_1 = require("../repositories/cursos.repo");
/* 🔹 Listar todos los cursos */
async function obtenerCursos(req, res) {
    try {
        const cursos = await (0, cursos_repo_1.listarCursos)();
        if (cursos.length === 0) {
            return res.json({ ok: false, mensaje: "No existen cursos" });
        }
        return res.json({ ok: true, cursos });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, mensaje: "Error al listar cursos" });
    }
}
/* 🔹 Obtener curso por ID */
async function obtenerCursoPorId(req, res) {
    try {
        const id = req.params.id; // ✅ conversión segura
        const curso = await (0, cursos_repo_1.buscarCursoPorId)(id);
        if (!curso) {
            return res.status(404).json({ ok: false, mensaje: "Curso no encontrado" });
        }
        res.json({ ok: true, curso });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, mensaje: "Error al obtener curso" });
    }
}
/* 🔹 Crear curso */
async function crearCursoController(req, res) {
    try {
        const { titulo, descripcion, publicado, creadoDesdeId } = req.body;
        if (!titulo) {
            return res.status(400).json({ ok: false, mensaje: "El título es requerido" });
        }
        const nuevo = await (0, cursos_repo_1.crearCurso)({
            titulo,
            descripcion: descripcion ?? null,
            publicado: publicado ?? false,
            creadoDesdeId: creadoDesdeId ?? null,
        });
        res.status(201).json({ ok: true, mensaje: "Curso creado", curso: nuevo });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, mensaje: "Error al crear curso" });
    }
}
/* 🔹 Actualizar curso */
async function actualizarCursoController(req, res) {
    try {
        const id = req.params.id; // ✅ conversión segura
        const { titulo, descripcion, publicado } = req.body;
        const actualizado = await (0, cursos_repo_1.actualizarCurso)({
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
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, mensaje: "Error al actualizar curso" });
    }
}
/* 🔹 Eliminar curso */
async function eliminarCursoController(req, res) {
    try {
        const id = req.params.id; // ✅ conversión segura
        const eliminado = await (0, cursos_repo_1.eliminarCurso)(id);
        if (!eliminado) {
            return res.status(404).json({ ok: false, mensaje: "Curso no encontrado" });
        }
        res.json({ ok: true, mensaje: "Curso eliminado" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, mensaje: "Error al eliminar curso" });
    }
}
/* 🔹 Obtener curso con tópicos */
async function obtenerCursoConTopicos(req, res) {
    try {
        const id = req.params.id; // ✅ conversión segura
        const curso = await (0, cursos_repo_1.buscarCursoConTopicos)(id);
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
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ ok: false, mensaje: "Error al obtener curso con tópicos" });
    }
}
//# sourceMappingURL=cursos.controller.js.map