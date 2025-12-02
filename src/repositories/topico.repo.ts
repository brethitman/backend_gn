// topicos.repo.ts
import { pool } from "../infrastructure/db";

// Tipo seguro para JSONB
export type JSONB = Record<string, unknown>;

// Definición de Topico
export type Topico = {
  id: string;
  idCurso: string;
  titulo: string;
  contenido?: JSONB | null;
  orden: number;
  creadoEn: Date;
};

export async function crearTopico(params: {
  idCurso: string;
  titulo: string;
  contenido?: JSONB | null;
  orden?: number;
}): Promise<Topico> {
  const q = `
    INSERT INTO topicos (id_curso, titulo, contenido, orden)
    VALUES ($1, $2, $3, COALESCE($4, 0))
    RETURNING id_topico AS id, id_curso, titulo, contenido, orden, creado_en
  `;
  const { rows } = await pool.query(q, [
    params.idCurso,
    params.titulo,
    params.contenido ?? null,
    params.orden ?? 0,
  ]);
  const r = rows[0];
  return {
    id: String(r.id),
    idCurso: String(r.id_curso),
    titulo: r.titulo,
    contenido: r.contenido,
    orden: r.orden,
    creadoEn: r.creado_en,
  };
}

export async function listarTopicos(): Promise<Topico[]> {
  const q = `
    SELECT id_topico, id_curso, titulo, contenido, orden, creado_en
    FROM topicos
    ORDER BY orden, creado_en
  `;
  const { rows } = await pool.query(q);
  return rows.map((r) => ({
    id: String(r.id_topico),
    idCurso: String(r.id_curso),
    titulo: r.titulo,
    contenido: r.contenido,
    orden: r.orden,
    creadoEn: r.creado_en,
  }));
}

export async function buscarTopicoPorId(id: string): Promise<Topico | null> {
  const q = `
    SELECT id_topico, id_curso, titulo, contenido, orden, creado_en
    FROM topicos
    WHERE id_topico = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(q, [id]);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: String(r.id_topico),
    idCurso: String(r.id_curso),
    titulo: r.titulo,
    contenido: r.contenido,
    orden: r.orden,
    creadoEn: r.creado_en,
  };
}

export async function actualizarTopico(params: {
  id: string;
  titulo?: string;
  contenido?: JSONB | null;
  orden?: number;
}): Promise<Topico | null> {
  const campos: string[] = [];
  const valores: (string | number | JSONB | null)[] = [];
  let i = 1;

  if (params.titulo !== undefined) {
    campos.push(`titulo = $${i++}`);
    valores.push(params.titulo);
  }
  if (params.contenido !== undefined) {
    campos.push(`contenido = $${i++}`);
    valores.push(params.contenido);
  }
  if (params.orden !== undefined) {
    campos.push(`orden = $${i++}`);
    valores.push(params.orden);
  }

  if (campos.length === 0) return null;

  valores.push(params.id);

  const q = `
    UPDATE topicos
    SET ${campos.join(", ")}
    WHERE id_topico = $${i}
    RETURNING id_topico AS id, id_curso, titulo, contenido, orden, creado_en
  `;
  const { rows } = await pool.query(q, valores);
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: String(r.id),
    idCurso: String(r.id_curso),
    titulo: r.titulo,
    contenido: r.contenido,
    orden: r.orden,
    creadoEn: r.creado_en,
  };
}

export async function insertarTopicoDespuesDe(params: {
  idCurso: string;
  titulo: string;
  contenido?: JSONB | null;
  afterTopicoId?: string | null;
}): Promise<Topico> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { idCurso, titulo, contenido = null, afterTopicoId = null } = params;
    let nuevoOrden = 1;

    if (afterTopicoId) {
      // Buscar el tópico de referencia
      const qRef = `
        SELECT orden FROM topicos
        WHERE id_topico = $1 AND id_curso = $2
      `;
      const { rows: refRows } = await client.query(qRef, [afterTopicoId, idCurso]);
      if (refRows.length === 0) {
        throw new Error("El tópico de referencia no existe en este curso");
      }

      nuevoOrden = refRows[0].orden + 1;
    }

    // Mover hacia abajo los tópicos con orden >= nuevoOrden
    const qUpdate = `
      UPDATE topicos
      SET orden = orden + 1
      WHERE id_curso = $1 AND orden >= $2
    `;
    await client.query(qUpdate, [idCurso, nuevoOrden]);

    // Crear el nuevo tópico
    const qInsert = `
      INSERT INTO topicos (id_curso, titulo, contenido, orden)
      VALUES ($1, $2, $3, $4)
      RETURNING id_topico AS id, id_curso, titulo, contenido, orden, creado_en
    `;
    const { rows } = await client.query(qInsert, [
      idCurso,
      titulo,
      contenido,
      nuevoOrden,
    ]);

    await client.query("COMMIT");

    const r = rows[0];
    return {
      id: String(r.id),
      idCurso: String(r.id_curso),
      titulo: r.titulo,
      contenido: r.contenido,
      orden: r.orden,
      creadoEn: r.creado_en,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

