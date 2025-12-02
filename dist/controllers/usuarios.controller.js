"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerUsuarios = obtenerUsuarios;
exports.actualizarUsuarioController = actualizarUsuarioController;
const usuarios_repo_1 = require("../repositories/usuarios.repo");
async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await (0, usuarios_repo_1.listarUsuarios)();
        return res.json({ ok: true, usuarios });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, mensaje: "Error al obtener usuarios" });
    }
}
async function actualizarUsuarioController(req, res) {
    try {
        const { id } = req.params;
        const { nombre, correo, rol, activo } = req.body;
        if (!id) {
            return res.status(400).json({ ok: false, mensaje: "ID de usuario es requerido" });
        }
        const usuarioActualizado = await (0, usuarios_repo_1.actualizarUsuario)({ id, nombre, correo, rol, activo });
        if (!usuarioActualizado) {
            return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado o sin cambios" });
        }
        return res.json({ ok: true, mensaje: "Usuario actualizado", usuario: usuarioActualizado });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, mensaje: "Error al actualizar usuario" });
    }
}
//# sourceMappingURL=usuarios.controller.js.map