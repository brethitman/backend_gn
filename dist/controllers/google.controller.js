"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackGoogle = callbackGoogle;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usuarios_repo_1 = require("../repositories/usuarios.repo");
function firmarJWT(payload) {
    const secret = process.env.JWT_SECRETO;
    const exp = process.env.JWT_EXPIRES;
    const expiresIn = exp && !Number.isNaN(Number(exp)) ? Number(exp) : 10800;
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
async function callbackGoogle(req, res) {
    try {
        const user = req.user;
        if (!user?.email) {
            const front = new URL("http://localhost:5173/");
            front.searchParams.set("error", "google_auth_failed");
            res.redirect(front.toString());
            return;
        }
        const email = user.email;
        const name = user.name ?? "";
        let usuario = (await (0, usuarios_repo_1.buscarPorCorreo)(email));
        if (!usuario) {
            usuario = (await (0, usuarios_repo_1.crearUsuario)({
                nombre: name,
                correo: email,
                contrasenaHash: "", // marcador para cuentas Google
                rol: "estudiante",
            }));
        }
        const token = firmarJWT({
            sub: String(usuario.id),
            rol: usuario.rol,
            correo: usuario.correo,
        });
        // Redirige al front con token y datos
        const urlFront = new URL("http://localhost:5173/login/");
        urlFront.searchParams.set("token", token);
        urlFront.searchParams.set("nombre", usuario.nombre);
        urlFront.searchParams.set("correo", usuario.correo);
        res.redirect(urlFront.toString());
    }
    catch (err) {
        console.error("[callbackGoogle] Error:", err);
        const front = new URL("http://localhost:5173/");
        front.searchParams.set("error", "google_auth_failed");
        res.redirect(front.toString());
    }
}
//# sourceMappingURL=google.controller.js.map