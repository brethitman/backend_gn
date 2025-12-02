"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerComentariosTopico = obtenerComentariosTopico;
exports.crearComentarioTopico = crearComentarioTopico;
exports.crearRespuestaComentario = crearRespuestaComentario;
const comentarios_repo_1 = require("../repositories/comentarios.repo");
// Obtener comentario + respuestas de un tópico
async function obtenerComentariosTopico(req, res) {
    try {
        const { idTopico } = req.params;
        // Validación obligatoria (evita string | undefined)
        if (!idTopico) {
            return res
                .status(400)
                .json({ ok: false, mensaje: "El idTopico es requerido" });
        }
        const comentario = await (0, comentarios_repo_1.obtenerComentarioPorTopico)(idTopico);
        return res.json({ ok: true, comentario });
    }
    catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ ok: false, mensaje: "Error al obtener comentarios" });
    }
}
// Crear comentario principal (solo si no existe)
async function crearComentarioTopico(req, res) {
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
        const creado = await (0, comentarios_repo_1.crearComentarioPrincipal)({
            idTopico,
            idUsuario,
            texto,
        });
        return res
            .status(201)
            .json({ ok: true, mensaje: "Comentario creado", creado });
    }
    catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ ok: false, mensaje: "Error al crear comentario" });
    }
}
// Crear respuesta a comentario existente
async function crearRespuestaComentario(req, res) {
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
        const respuesta = await (0, comentarios_repo_1.crearRespuesta)({
            idComentario,
            idUsuario,
            texto,
        });
        return res
            .status(201)
            .json({ ok: true, mensaje: "Respuesta agregada", respuesta });
    }
    catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ ok: false, mensaje: "Error al crear respuesta" });
    }
}
//# sourceMappingURL=comentarios.controller.js.map