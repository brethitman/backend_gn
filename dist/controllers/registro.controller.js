"use strict";
//C:\Users\Ffcg\Music\main de main\google\GENERACION-DE-SOFTWARE\BACKEND_GS\src\controllers\registro.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarUsuario = registrarUsuario;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usuarios_repo_1 = require("../repositories/usuarios.repo");
const codigo_verificacion_service_1 = require("../services/codigo-verificacion.service");
const codigoVerificacionService = new codigo_verificacion_service_1.CodigoVerificacionService();
async function registrarUsuario(req, res) {
    try {
        const { nombre, correo, contrasena, rol } = req.body;
        const yaExiste = await (0, usuarios_repo_1.buscarPorCorreo)(correo);
        if (yaExiste) {
            return res.status(409).json({ ok: false, mensaje: "El correo ya está registrado" });
        }
        const contrasenaHash = await bcryptjs_1.default.hash(contrasena, 10);
        const usuario = await (0, usuarios_repo_1.crearUsuario)({ nombre, correo, contrasenaHash, rol });
        // ✅ ENVIAR CÓDIGO DE VERIFICACIÓN
        await codigoVerificacionService.enviarCodigoVerificacion(usuario.correo, usuario.nombre, Number(usuario.id));
        // ✅ RESPONDER CON usuarioId PARA LA VERIFICACIÓN
        return res.status(201).json({
            ok: true,
            mensaje: "Registro exitoso. Se ha enviado un código de verificación a tu correo.",
            requiereVerificacion: true,
            usuarioId: Number(usuario.id) // ✅ ESTO ES LO QUE NECESITA EL FRONTEND
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
    }
}
//# sourceMappingURL=registro.controller.js.map