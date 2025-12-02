"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistroSchema = void 0;
exports.validarRegistro = validarRegistro;
const zod_1 = require("zod");
exports.RegistroSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(3).max(120),
    correo: zod_1.z.string().email(),
    contrasena: zod_1.z.string().min(8).max(100),
    rol: zod_1.z.enum(["docente", "estudiante", "administrador"]).default("estudiante"),
});
function validarRegistro(req, res, next) {
    const parsed = exports.RegistroSchema.safeParse(req.body);
    if (!parsed.success) {
        const errores = parsed.error.issues.map(i => ({ campo: i.path.join("."), mensaje: i.message }));
        return res.status(400).json({ ok: false, mensaje: "Datos inválidos", errores });
    }
    req.body = parsed.data;
    next();
}
//# sourceMappingURL=validacion.middleware.js.map