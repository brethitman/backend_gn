"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarUsuario = verificarUsuario;
exports.obtenerUsuarioPorId = obtenerUsuarioPorId;
exports.marcarUsuarioComoVerificado = marcarUsuarioComoVerificado;
//C:\Users\Ffcg\Music\main de main\google\GENERACION-DE-SOFTWARE\BACKEND_GS\src\repositories\autenticacion.repo.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../infrastructure/db");
/**
 * Verifica un usuario por correo y contraseña.
 * Retorna los datos públicos del usuario o null si no coincide.
 */
async function verificarUsuario(correo, contrasena_plana) {
    // 1️⃣ Buscar el usuario por correo (incluir el hash)
    const sql = `
    SELECT 
      id_usuario,
      nombre_completo,
      correo::text AS correo,
      rol,
      activo,
      verificado, -- ✅ NUEVO CAMPO
      contrasena_hash
    FROM public.usuarios
    WHERE correo = $1
    LIMIT 1;
  `;
    const filas = await (0, db_1.ejecutarFilas)(sql, [correo.trim()]);
    const u = filas.at(0);
    if (!u)
        return null; // no existe ese correo
    // 2️⃣ Comparar contraseña plana con hash usando bcrypt
    const coincide = await bcryptjs_1.default.compare(contrasena_plana, u.contrasena_hash);
    if (!coincide)
        return null;
    // 3️⃣ Devolver el usuario sin incluir el hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena_hash, ...publico } = u;
    return publico;
}
/**
 * Obtiene un usuario por ID
 */
async function obtenerUsuarioPorId(id_usuario) {
    const sql = `
    SELECT 
      id_usuario,
      nombre_completo,
      correo::text AS correo,
      rol,
      activo,
      verificado
    FROM public.usuarios
    WHERE id_usuario = $1
    LIMIT 1;
  `;
    const filas = await (0, db_1.ejecutarFilas)(sql, [id_usuario]);
    return filas[0] || null;
}
/**
 * Marca un usuario como verificado
 */
async function marcarUsuarioComoVerificado(id_usuario) {
    const sql = `
    UPDATE public.usuarios 
    SET verificado = true 
    WHERE id_usuario = $1
  `;
    await (0, db_1.ejecutarConsulta)(sql, [id_usuario]);
}
//# sourceMappingURL=autenticacion.repo.js.map