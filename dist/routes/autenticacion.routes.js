"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/autenticacion.routes.ts
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const autenticacion_controller_1 = require("../controllers/autenticacion.controller");
const registro_controller_1 = require("../controllers/registro.controller");
const validacion_middleware_1 = require("../middlewares/validacion.middleware");
const router = (0, express_1.Router)();
// Login tradicional
router.post("/login", autenticacion_controller_1.iniciarSesion);
// Registro tradicional
router.post("/registro", validacion_middleware_1.validarRegistro, registro_controller_1.registrarUsuario);
// Login con Google
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
// Callback de Google
router.get("/google/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(500).json({
            ok: false,
            mensaje: "Error al autenticar con Google",
        });
    }
    const { usuario, token } = req.user;
    // Redirige al frontend con los datos en la URL
    const frontendCallbackUrl = new URL('http://localhost:5173/auth/google-success');
    frontendCallbackUrl.searchParams.set('token', token);
    frontendCallbackUrl.searchParams.set('usuario', encodeURIComponent(JSON.stringify({
        id: String(usuario.id_usuario),
        nombre: usuario.nombre_completo,
        correo: usuario.correo,
        rol: usuario.rol,
    })));
    res.redirect(frontendCallbackUrl.toString());
});
exports.default = router;
//# sourceMappingURL=autenticacion.routes.js.map