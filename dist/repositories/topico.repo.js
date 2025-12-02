"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearTopico = crearTopico;
exports.listarTopicos = listarTopicos;
exports.buscarTopicoPorId = buscarTopicoPorId;
exports.actualizarTopico = actualizarTopico;
exports.insertarTopicoDespuesDe = insertarTopicoDespuesDe;
// topicos.repo.ts
const db_1 = require("../infrastructure/db");
async function crearTopico(params) {
    const q = `
    INSERT INTO topicos (id_curso, titulo, contenido, orden)
    VALUES ($1, $2, $3, COALESCE($4, 0))
    RETURNING id_topico AS id, id_curso, titulo, contenido, orden, creado_en
  `;
    const { rows } = await db_1.pool.query(q, [
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
async function listarTopicos() {
    const q = `
    SELECT id_topico, id_curso, titulo, contenido, orden, creado_en
    FROM topicos
    ORDER BY orden, creado_en
  `;
    const { rows } = await db_1.pool.query(q);
    return rows.map((r) => ({
        id: String(r.id_topico),
        idCurso: String(r.id_curso),
        titulo: r.titulo,
        contenido: r.contenido,
        orden: r.orden,
        creadoEn: r.creado_en,
    }));
}
async function buscarTopicoPorId(id) {
    const q = `
    SELECT id_topico, id_curso, titulo, contenido, orden, creado_en
    FROM topicos
    WHERE id_topico = $1
    LIMIT 1
  `;
    const { rows } = await db_1.pool.query(q, [id]);
    if (rows.length === 0)
        return null;
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
async function actualizarTopico(params) {
    const campos = [];
    const valores = [];
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
    if (campos.length === 0)
        return null;
    valores.push(params.id);
    const q = `
    UPDATE topicos
    SET ${campos.join(", ")}
    WHERE id_topico = $${i}
    RETURNING id_topico AS id, id_curso, titulo, contenido, orden, creado_en
  `;
    const { rows } = await db_1.pool.query(q, valores);
    if (rows.length === 0)
        return null;
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
async function insertarTopicoDespuesDe(params) {
    const client = await db_1.pool.connect();
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
    }
    catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
}
//# sourceMappingURL=topico.repo.js.map