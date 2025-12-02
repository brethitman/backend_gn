//C:\Users\Ffcg\Videos\copi_google\GENERACION_DE_SOFTWARE\BACKEND_GS\src\infrastructure\passport-google.ts
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { GoogleProfile, GoogleUserPayload, UsuarioBase, UsuarioConGoogle } from "../types/google-oauth.types";

import { ejecutarFilas } from "./db";

// Función para verificar si un usuario tiene google_id
function tieneGoogleId(usuario: UsuarioConGoogle | UsuarioBase): usuario is UsuarioConGoogle {
  return 'google_id' in usuario;
}

// Función para verificar si un arreglo tiene al menos un elemento
function tieneElementos<T>(arreglo: T[]): arreglo is [T, ...T[]] {
  return arreglo.length > 0;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GoogleProfile,
      done: (error: Error | null, user?: GoogleUserPayload) => void
    ) => {
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
        const filas = await ejecutarFilas<UsuarioConGoogle>(sql, [correo]);
        let usuario: UsuarioConGoogle | UsuarioBase | undefined = filas[0];

        if (!usuario) {
          // Si no existe, crear el usuario
          const insertSql = `
            INSERT INTO usuarios (nombre_completo, correo, rol, activo, google_id)
            VALUES ($1, $2, 'estudiante', true, $3)
            RETURNING id_usuario, nombre_completo, correo, rol, activo;
          `;
          const nuevasFilas = await ejecutarFilas<{
            id_usuario: number;
            nombre_completo: string;
            correo: string;
            rol: "estudiante" | "docente" | "administrador";
            activo: boolean;
          }>(insertSql, [profile.displayName, correo, profile.id]);

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
        } else if (!tieneGoogleId(usuario)) {
          // Si existe pero no tiene google_id, actualizarlo
          const updateSql = `
            UPDATE usuarios
            SET google_id = $1
            WHERE id_usuario = $2
            RETURNING id_usuario, nombre_completo, correo, rol, activo;
          `;
          const filasActualizadas = await ejecutarFilas<{
            id_usuario: number;
            nombre_completo: string;
            correo: string;
            rol: "estudiante" | "docente" | "administrador";
            activo: boolean;
          }>(updateSql, [profile.id, usuario.id_usuario]);

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
        const token = jwt.sign(
          {
            sub: String(usuario.id_usuario),
            rol: usuario.rol,
            correo: usuario.correo,
          },
          JWT_SECRETO,
          { expiresIn: "8h" }
        );

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
      } catch (err) {
        done(err instanceof Error ? err : new Error("Error desconocido"));
      }
    }
  )
);
