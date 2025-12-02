import { pool } from "../infrastructure/db";

export type Comentario = {
  idComentario: string;
  autor: string;
  texto: string;
  respuestas: {
    idRespuesta: string;
    autor: string;
    texto: string;
  }[];
};

export async function obtenerComentarioPorTopico(idTopico: string): Promise<Comentario | null> {
  const q = `
    SELECT c.id_comentario,
           u.nombre_completo AS autor,
           c.comentario AS texto
    FROM topico_comentarios c
    JOIN usuarios u ON u.id_usuario = c.id_usuario
    WHERE c.id_topico = $1
    LIMIT 1
  `;
  const { rows } = await pool.query(q, [idTopico]);
  if (rows.length === 0) return null;

  const comentario = rows[0];

  // Obtener respuestas
  const qResp = `
    SELECT r.id_respuesta,
           u.nombre_completo AS autor,
           r.respuesta AS texto
    FROM topico_respuestas r
    JOIN usuarios u ON u.id_usuario = r.id_usuario
    WHERE r.id_comentario = $1
    ORDER BY r.id_respuesta ASC
  `;
  const { rows: respRows } = await pool.query(qResp, [comentario.id_comentario]);

  return {
    idComentario: comentario.id_comentario,
    autor: comentario.autor,
    texto: comentario.texto,
    respuestas: respRows.map(r => ({
      idRespuesta: r.id_respuesta,
      autor: r.autor,
      texto: r.texto,
    })),
  };
}

export async function crearComentarioPrincipal(params: {
  idTopico: string;
  idUsuario: string;
  texto: string;
}) {
  const q = `
    INSERT INTO topico_comentarios (id_topico, id_usuario, comentario)
    VALUES ($1, $2, $3)
    RETURNING id_comentario
  `;
  const { rows } = await pool.query(q, [params.idTopico, params.idUsuario, params.texto]);
  return rows[0];
}

export async function crearRespuesta(params: {
  idComentario: string;
  idUsuario: string;
  texto: string;
}) {
  const q = `
    INSERT INTO topico_respuestas (id_comentario, id_usuario, respuesta)
    VALUES ($1, $2, $3)
    RETURNING id_respuesta
  `;
  const { rows } = await pool.query(q, [
    params.idComentario,
    params.idUsuario,
    params.texto,
  ]);
  return rows[0];
}
