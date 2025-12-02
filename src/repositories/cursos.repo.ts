import { pool } from "../infrastructure/db";

import { Topico } from "./topico.repo";

export type Curso = {
  id: string;
  titulo: string;
  descripcion?: string | null;
  publicado: boolean;
  creadoEn: Date;
  creadoDesdeId?: string | null;
  topicos?: Topico[];
};

/* 🔹 Listar todos los cursos */
export async function listarCursos(): Promise<Curso[]> {
  const q = `
    SELECT id_curso, titulo, descripcion, publicado, creado_en, creado_desde_id
    FROM cursos
    ORDER BY creado_en DESC
  `;
  const { rows } = await pool.query(q);
  return rows.map((r) => ({
    id: String(r.id_curso),
    titulo: r.titulo,
    descripcion: r.descripcion,
    publicado: r.publicado,
    creadoEn: r.creado_en,
    creadoDesdeId: r.creado_desde_id ? String(r.creado_desde_id) : null,
  }));
}

/* 🔹 Buscar curso por ID */
export async function buscarCursoPorId(id: string): Promise<Curso | null> {
  const q = `
    SELECT id_curso, titulo, descripcion, publicado, creado_en, creado_desde_id
    FROM cursos
    WHERE id_curso = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(q, [id]);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: String(r.id_curso),
    titulo: r.titulo,
    descripcion: r.descripcion,
    publicado: r.publicado,
    creadoEn: r.creado_en,
    creadoDesdeId: r.creado_desde_id ? String(r.creado_desde_id) : null,
  };
}

/* 🔹 Crear curso */
export async function crearCurso(params: {
  titulo: string;
  descripcion?: string | null;
  publicado?: boolean;
  creadoDesdeId?: string | null;
}): Promise<Curso> {
  const q = `
    INSERT INTO cursos (titulo, descripcion, publicado, creado_desde_id, creado_en)
    VALUES ($1, $2, COALESCE($3, false), $4, NOW())
    RETURNING id_curso, titulo, descripcion, publicado, creado_en, creado_desde_id
  `;
  const { rows } = await pool.query(q, [
    params.titulo,
    params.descripcion ?? null,
    params.publicado ?? false,
    params.creadoDesdeId ?? null,
  ]);
  const r = rows[0];
  return {
    id: String(r.id_curso),
    titulo: r.titulo,
    descripcion: r.descripcion,
    publicado: r.publicado,
    creadoEn: r.creado_en,
    creadoDesdeId: r.creado_desde_id ? String(r.creado_desde_id) : null,
  };
}

/* 🔹 Actualizar curso */
export async function actualizarCurso(params: {
  id: string;
  titulo?: string;
  descripcion?: string | null;
  publicado?: boolean;
}): Promise<Curso | null> {
  const campos: string[] = [];
  const valores: (string | boolean | null)[] = [];
  let i = 1;

  if (params.titulo !== undefined) {
    campos.push(`titulo = $${i++}`);
    valores.push(params.titulo);
  }
  if (params.descripcion !== undefined) {
    campos.push(`descripcion = $${i++}`);
    valores.push(params.descripcion);
  }
  if (params.publicado !== undefined) {
    campos.push(`publicado = $${i++}`);
    valores.push(params.publicado);
  }

  if (campos.length === 0) return null;
  valores.push(params.id);

  const q = `
    UPDATE cursos
    SET ${campos.join(", ")}
    WHERE id_curso = $${i}
    RETURNING id_curso, titulo, descripcion, publicado, creado_en, creado_desde_id
  `;

  const { rows } = await pool.query(q, valores);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: String(r.id_curso),
    titulo: r.titulo,
    descripcion: r.descripcion,
    publicado: r.publicado,
    creadoEn: r.creado_en,
    creadoDesdeId: r.creado_desde_id ? String(r.creado_desde_id) : null,
  };
}

/* 🔹 Eliminar curso */
export async function eliminarCurso(id: string): Promise<boolean> {
  const q = `DELETE FROM cursos WHERE id_curso = $1`;
  const result = await pool.query(q, [id]);
  return (result.rowCount ?? 0) > 0; 
}

/* 🔹 Obtener tópicos asociados a un curso */
export async function listarTopicosPorCurso(idCurso: string): Promise<Topico[]> {
  const q = `
    SELECT id_topico, id_curso, titulo, contenido, orden, creado_en
    FROM topicos
    WHERE id_curso = $1
    ORDER BY orden, creado_en
  `;
  const { rows } = await pool.query(q, [idCurso]);
  return rows.map((r) => ({
    id: String(r.id_topico),
    idCurso: String(r.id_curso),
    titulo: r.titulo,
    contenido: r.contenido,
    orden: r.orden,
    creadoEn: r.creado_en,
  }));
}

/* 🔹 Obtener curso con sus tópicos */
export async function buscarCursoConTopicos(idCurso: string): Promise<Curso | null> {
  const curso = await buscarCursoPorId(idCurso);
  if (!curso) return null;

  const topicos = await listarTopicosPorCurso(idCurso);
  curso.topicos = topicos;
  return curso;
}
