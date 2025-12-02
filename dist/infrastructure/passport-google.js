"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//C:\Users\Ffcg\Videos\copi_google\GENERACION_DE_SOFTWARE\BACKEND_GS\src\infrastructure\passport-google.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const db_1 = require("./db");
// Función para verificar si un usuario tiene google_id
function tieneGoogleId(usuario) {
    return 'google_id' in usuario;
}
// Función para verificar si un arreglo tiene al menos un elemento
function tieneElementos(arreglo) {
    return arreglo.length > 0;
}
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const correo = profile.emails?.[0]?.value;
        if (!correo) {
            throw new Error("No se pudo obtener el correo de Google");
        }
        // Buscar usuario por correo
        const sql = `
          SELECT
            id_usuario,
            nombre_completo,
            correo,
            rol,
            activo,
            google_id
          FROM usuarios
          WHERE correo = $1
          LIMIT 1;
        `;
        const filas = await (0, db_1.ejecutarFilas)(sql, [correo]);
        let usuario = filas[0];
        if (!usuario) {
            // Si no existe, crear el usuario
            const insertSql = `
            INSERT INTO usuarios (nombre_completo, correo, rol, activo, google_id)
            VALUES ($1, $2, 'estudiante', true, $3)
            RETURNING id_usuario, nombre_completo, correo, rol, activo;
          `;
            const nuevasFilas = await (0, db_1.ejecutarFilas)(insertSql, [profile.displayName, correo, profile.id]);
            // Verificamos que nuevasFilas tenga al menos un elemento
            if (!tieneElementos(nuevasFilas)) {
                throw new Error("Error al crear el usuario en la base de datos");
            }
            // Aseguramos que todas las propiedades requeridas estén presentes
            const nuevaFila = nuevasFilas[0];
            usuario = {
                id_usuario: nuevaFila.id_usuario,
                nombre_completo: nuevaFila.nombre_completo,
                correo: nuevaFila.correo,
                rol: nuevaFila.rol,
                activo: nuevaFila.activo,
                google_id: profile.id,
            };
        }
        else if (!tieneGoogleId(usuario)) {
            // Si existe pero no tiene google_id, actualizarlo
            const updateSql = `
            UPDATE usuarios
            SET google_id = $1
            WHERE id_usuario = $2
            RETURNING id_usuario, nombre_completo, correo, rol, activo;
          `;
            const filasActualizadas = await (0, db_1.ejecutarFilas)(updateSql, [profile.id, usuario.id_usuario]);
            // Verificamos que filasActualizadas tenga al menos un elemento
            if (!tieneElementos(filasActualizadas)) {
                throw new Error("Error al actualizar el usuario en la base de datos");
            }
            // Aseguramos que todas las propiedades requeridas estén presentes
            const filaActualizada = filasActualizadas[0];
            usuario = {
                id_usuario: filaActualizada.id_usuario,
                nombre_completo: filaActualizada.nombre_completo,
                correo: filaActualizada.correo,
                rol: filaActualizada.rol,
                activo: filaActualizada.activo,
                google_id: profile.id,
            };
        }
        // Verificamos que usuario no sea undefined antes de usarlo
        if (!usuario) {
            throw new Error("Error al crear el usuario");
        }
        // Generar JWT
        const JWT_SECRETO = process.env.JWT_SECRETO ?? "secreto_dev";
        const token = jsonwebtoken_1.default.sign({
            sub: String(usuario.id_usuario),
            rol: usuario.rol,
            correo: usuario.correo,
        }, JWT_SECRETO, { expiresIn: "8h" });
        // Devolver usuario + token
        done(null, {
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre_completo: usuario.nombre_completo,
                correo: usuario.correo,
                rol: usuario.rol,
                activo: usuario.activo,
            },
            token,
        });
    }
    catch (err) {
        done(err instanceof Error ? err : new Error("Error desconocido"));
    }
}));
//# sourceMappingURL=passport-google.js.map