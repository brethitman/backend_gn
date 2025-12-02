"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iniciarSesion = iniciarSesion;
exports.verificarCodigo = verificarCodigo;
exports.reenviarCodigo = reenviarCodigo;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const autenticacion_repo_1 = require("../repositories/autenticacion.repo");
const codigo_verificacion_service_1 = require("../services/codigo-verificacion.service");
// Tipamos el secreto como Secret de jsonwebtoken
const JWT_SECRETO = (process.env.JWT_SECRETO ?? "secreto_dev");
const JWT_EXPIRES = (process.env.JWT_EXPIRES ?? "8h");
const codigoVerificacionService = new codigo_verificacion_service_1.CodigoVerificacionService();
/**
 * POST /api/v1/autenticacion/login
 * Body: { correo: string, contrasena: string }
 */
async function iniciarSesion(req, res, next) {
    try {
        const correo = (req.body?.correo ?? "").trim();
        const contrasena = req.body?.contrasena ?? "";
        if (!correo || !contrasena) {
            return res
                .status(400)
                .json({ ok: false, mensaje: "Faltan el correo o la contraseña." });
        }
        // Debe usar bcrypt.compare dentro del repo y devolver null si no coincide
        const usuario = await (0, autenticacion_repo_1.verificarUsuario)(correo, contrasena);
        if (!usuario) {
            return res
                .status(401)
                .json({ ok: false, mensaje: "Credenciales inválidas." });
        }
        if (usuario.activo === false) {
            return res.status(403).json({ ok: false, mensaje: "Usuario inactivo." });
        }
        // 🔐 VERIFICACIÓN: Si el usuario no está verificado, enviar código
        if (!usuario.verificado) {
            await codigoVerificacionService.enviarCodigoVerificacion(usuario.correo, usuario.nombre_completo, usuario.id_usuario);
            return res.status(200).json({
                ok: true,
                mensaje: "Código de verificación enviado a tu correo",
                requiereVerificacion: true,
                usuarioId: usuario.id_usuario
            });
        }
        // ✅ Usuario verificado - proceder con login normal
        const payload = {
            sub: String(usuario.id_usuario),
            rol: usuario.rol,
            correo: usuario.correo,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRETO, { expiresIn: JWT_EXPIRES });
        return res.status(200).json({
            ok: true,
            mensaje: "Inicio de sesión exitoso",
            datos: {
                usuario: {
                    id: String(usuario.id_usuario),
                    nombre: usuario.nombre_completo,
                    correo: usuario.correo,
                    rol: usuario.rol,
                },
                token,
            },
        });
    }
    catch (err) {
        return next(err);
    }
}
/**
 * POST /api/v1/autenticacion/verificar-codigo
 * Body: { usuarioId: number, codigo: string }
 */
async function verificarCodigo(req, res, next) {
    try {
        const { usuarioId, codigo } = req.body;
        if (!usuarioId || !codigo) {
            return res.status(400).json({
                ok: false,
                mensaje: "Faltan el ID de usuario o el código"
            });
        }
        const esValido = await codigoVerificacionService.verificarCodigo(codigo, usuarioId);
        if (!esValido) {
            return res.status(400).json({
                ok: false,
                mensaje: "Código inválido o expirado"
            });
        }
        // Marcar usuario como verificado en la base de datos
        await (0, autenticacion_repo_1.marcarUsuarioComoVerificado)(usuarioId);
        return res.status(200).json({
            ok: true,
            mensaje: "Correo verificado exitosamente"
        });
    }
    catch (err) {
        return next(err);
    }
}
/**
 * POST /api/v1/autenticacion/reenviar-codigo
 * Body: { usuarioId: number }
 */
async function reenviarCodigo(req, res, next) {
    try {
        const { usuarioId } = req.body;
        if (!usuarioId) {
            return res.status(400).json({
                ok: false,
                mensaje: "Falta el ID de usuario"
            });
        }
        const usuario = await (0, autenticacion_repo_1.obtenerUsuarioPorId)(usuarioId);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                mensaje: "Usuario no encontrado"
            });
        }
        await codigoVerificacionService.enviarCodigoVerificacion(usuario.correo, usuario.nombre_completo, usuario.id_usuario);
        return res.status(200).json({
            ok: true,
            mensaje: "Código reenviado exitosamente"
        });
    }
    catch (err) {
        return next(err);
    }
}
//# sourceMappingURL=autenticacion.controller.js.map