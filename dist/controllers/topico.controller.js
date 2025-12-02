"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerTopicos = obtenerTopicos;
exports.obtenerTopicoPorId = obtenerTopicoPorId;
exports.crearTopicoController = crearTopicoController;
exports.actualizarTopicoController = actualizarTopicoController;
exports.insertarTopicoDespuesDeController = insertarTopicoDespuesDeController;
const topico_repo_1 = require("../repositories/topico.repo");
const topico_repo_2 = require("../repositories/topico.repo");
async function obtenerTopicos(req, res) {
    try {
        const topicos = await (0, topico_repo_2.listarTopicos)();
        return res.json({ ok: true, topicos });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, mensaje: "Error al obtener tópicos" });
    }
}
async function obtenerTopicoPorId(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ ok: false, mensaje: "ID de tópico es requerido" });
        }
        const topico = await (0, topico_repo_2.buscarTopicoPorId)(id);
        if (!topico) {
            return res.status(404).json({ ok: false, mensaje: "Tópico no encontrado" });
        }
        return res.json({ ok: true, topico });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, mensaje: "Error al obtener el tópico" });
    }
}
async function crearTopicoController(req, res) {
    try {
        const { idCurso, titulo, contenido, orden } = req.body;
        if (!idCurso || !titulo) {
            return res.status(400).json({ ok: false, mensaje: "idCurso y titulo son requeridos" });
        }
        const nuevoTopico = await (0, topico_repo_2.crearTopico)({ idCurso, titulo, contenido, orden });
        return res.status(201).json({ ok: true, mensaje: "Tópico creado", topico: nuevoTopico });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, mensaje: "Error al crear el tópico" });
    }
}
async function actualizarTopicoController(req, res) {
    try {
        const { id } = req.params;
        const { titulo, contenido, orden } = req.body;
        if (!id) {
            return res.status(400).json({ ok: false, mensaje: "ID de tópico es requerido" });
        }
        const topicoActualizado = await (0, topico_repo_2.actualizarTopico)({ id, titulo, contenido, orden });
        if (!topicoActualizado) {
            return res.status(404).json({ ok: false, mensaje: "Tópico no encontrado o sin cambios" });
        }
        return res.json({ ok: true, mensaje: "Tópico actualizado", topico: topicoActualizado });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, mensaje: "Error al actualizar el tópico" });
    }
}
async function insertarTopicoDespuesDeController(req, res) {
    try {
        const { idCurso, titulo, contenido, afterTopicoId } = req.body;
        if (!idCurso || !titulo) {
            return res.status(400).json({ ok: false, mensaje: "idCurso y titulo son requeridos" });
        }
        const nuevoTopico = await (0, topico_repo_1.insertarTopicoDespuesDe)({
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
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, mensaje: "Error al insertar el tópico" });
    }
}
//# sourceMappingURL=topico.controller.js.map