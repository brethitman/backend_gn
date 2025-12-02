//C:\Users\Ffcg\Music\main de main\google\GENERACION-DE-SOFTWARE\BACKEND_GS\src\repositories\usuarios.repo.ts
import { pool } from "../infrastructure/db";

export type Rol = "editor" | "ejecutor" | "estudiante" | "administrador";
export type Usuario = { id: string; nombre: string; correo: string; rol: Rol; activo?: boolean };

export async function buscarPorCorreo(correo: string): Promise<(Usuario & { contrasena_hash?: string }) | null> {
  const q = `
    SELECT id_usuario, nombre_completo, correo, rol, activo, contrasena_hash
    FROM usuarios
    WHERE correo = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(q, [correo]);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: String(r.id_usuario),
    nombre: r.nombre_completo,
    correo: r.correo,
    rol: r.rol,
    activo: r.activo,
    contrasena_hash: r.contrasena_hash,
  };
}

export async function crearUsuario(params: {
  nombre: string;
  correo: string;
  contrasenaHash: string;
  rol: Rol;
}): Promise<Usuario> {
  const q = `
    INSERT INTO usuarios (nombre_completo, correo, contrasena_hash, rol, activo)
    VALUES ($1, $2, $3, $4, true)
    RETURNING id_usuario AS id, nombre_completo AS nombre, correo, rol
  `;
  const { rows } = await pool.query(q, [
    params.nombre,
    params.correo,
    params.contrasenaHash,
    params.rol,
  ]);
  return {
    id: String(rows[0].id),
    nombre: rows[0].nombre,
    correo: rows[0].correo,
    rol: rows[0].rol,
  };
}
export async function listarUsuarios(): Promise<Usuario[]> {
  const q = `
    SELECT id_usuario, nombre_completo, correo, rol, activo
    FROM usuarios
    ORDER BY nombre_completo
  `;
  const { rows } = await pool.query(q);
  return rows.map((r) => ({
    id: String(r.id_usuario),
    nombre: r.nombre_completo,
    correo: r.correo,
    rol: r.rol,
    activo: r.activo,
  }));
}
export async function actualizarUsuario(params: {
  id: string;
  nombre?: string;
  correo?: string;
  rol?: Rol;
  activo?: boolean;
}): Promise<Usuario | null> {
  const campos: string[] = [];
  const valores: (string | boolean)[] = [];
  let i = 1;

  if (params.nombre !== undefined) {
    campos.push(`nombre_completo = $${i++}`);
    valores.push(params.nombre);
  }
  if (params.correo !== undefined) {
    campos.push(`correo = $${i++}`);
    valores.push(params.correo);
  }
  if (params.rol !== undefined) {
    campos.push(`rol = $${i++}`);
    valores.push(params.rol);
  }
  if (params.activo !== undefined) {
    campos.push(`activo = $${i++}`);
    valores.push(params.activo);
  }

  if (campos.length === 0) return null; // Nada que actualizar

  valores.push(params.id);

  const q = `
    UPDATE usuarios
    SET ${campos.join(", ")}
    WHERE id_usuario = $${i}
    RETURNING id_usuario AS id, nombre_completo AS nombre, correo, rol, activo
  `;

  const { rows } = await pool.query(q, valores);
  if (rows.length === 0) return null;

  const r = rows[0];
  return {
    id: String(r.id),
    nombre: r.nombre,
    correo: r.correo,
    rol: r.rol,
    activo: r.activo,
  };
}


