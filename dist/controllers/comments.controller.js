"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*import type { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";
import { Pool } from "pg";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}


export interface AuthUser {
  id: number;
  rol: "admin" | "docente" | "editor" | "estudiante";
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

/* -------------------------------------------------------------------------- */
/*  Pool de PostgreSQL                                                         */
/* -------------------------------------------------------------------------- */
/*
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgresql://user:pass@localhost:5432/tu_db",
});

/* -------------------------------------------------------------------------- */
/*  Tipos de filas                                                             */
/* -------------------------------------------------------------------------- */
/*
interface CommentRecord {
  id: number;
  author_id: number;
  topico_id: number;
  parent_id: number | null;
  body: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
  author_name?: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */
/*
function requireAuth(req: Request, res: Response): AuthUser | null {
  const u = req.user;
  if (!u || typeof u.id !== "number") {
    res.status(401).json({ ok: false, mensaje: "No autenticado." });
    return null;
  }
  return u;
}

function userIsEditor(rol: AuthUser["rol"]): boolean {
  return rol === "docente" || rol === "admin" || rol === "editor";
}

/* -------------------------------------------------------------------------- */
/*  Validaciones                                                               */
/* -------------------------------------------------------------------------- */
/*
export const validarCrearComentario = [
  body("body")
    .isString()
    .isLength({ min: 1, max: 5000 })
    .withMessage("Comentario inválido"),
  body("topico_id").isInt({ min: 1 }).toInt(),
  body("parent_id").optional().isInt({ min: 1 }).toInt(),
];

/* -------------------------------------------------------------------------- */
/*  POST /api/v1/comments  (crear comentario)                                  */
/*  Solo usuarios "editores" pueden comentar                                   */
/* -------------------------------------------------------------------------- */
/*
export async function crearComentario(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = requireAuth(req, res);
    if (!user) return;

    // Solo editores
    if (!userIsEditor(user.rol)) {
      res
        .status(403)
        .json({ ok: false, mensaje: "Solo los editores pueden comentar." });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ ok: false, errores: errors.array() });
      return;
    }

    const { body: texto, topico_id, parent_id } = req.body as {
      body: string;
      topico_id: number;
      parent_id?: number;
    };

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertQuery = `
        INSERT INTO public.comments (author_id, topico_id, parent_id, body, is_deleted)
        VALUES ($1, $2, $3, $4, false)
        RETURNING id, author_id, topico_id, parent_id, body, is_deleted, created_at, updated_at
      `;
      const values = [user.id, topico_id, parent_id ?? null, texto];
      const result = await client.query<CommentRecord>(insertQuery, values);
      const comentario = result.rows.at(0);

      if (!comentario) {
        await client.query("ROLLBACK");
        res
          .status(500)
          .json({ ok: false, mensaje: "No se pudo crear el comentario." });
        return;
      }

      // Intentar actualizar contador (si la columna existe)
      try {
        await client.query(
          "UPDATE public.topicos SET comments_count = comments_count + 1 WHERE id_topico = $1",
          [topico_id]
        );
      } catch {
        // Si no existe la columna, lo ignoramos sin romper la transacción
      }

      await client.query("COMMIT");
      res.status(201).json({ ok: true, comentario });
    } catch (err) {
      await client.query("ROLLBACK");
      next(err);
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}

/* -------------------------------------------------------------------------- */
/*  GET /api/v1/comments/topico/:topicoId  (listar comentarios)                */
/* -------------------------------------------------------------------------- */
/*
export async function listarComentariosPorTopico(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const topicoId = Number(req.params.topicoId);
    if (!Number.isInteger(topicoId) || topicoId <= 0) {
      res.status(400).json({ ok: false, mensaje: "ID de tópico inválido." });
      return;
    }

    const client = await pool.connect();
    try {
      const sql = `
        SELECT c.id,
               c.parent_id,
               c.body,
               c.created_at,
               c.updated_at,
               u.id_usuario AS author_id,
               u.nombre_completo AS author_name
        FROM public.comments c
        JOIN public.usuarios u ON u.id_usuario = c.author_id
        WHERE c.topico_id = $1 AND c.is_deleted = false
        ORDER BY c.created_at DESC, c.id DESC
        LIMIT 200
      `;
      const result = await client.query<CommentRecord>(sql, [topicoId]);
      res.json({ ok: true, comentarios: result.rows });
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}

/* -------------------------------------------------------------------------- */
/*  DELETE /api/v1/comments/:id  (soft delete: autor o admin)                  */
/* -------------------------------------------------------------------------- */
/*
export async function borrarComentario(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = requireAuth(req, res);
    if (!user) return;

    const comentarioId = Number(req.params.id);
    if (!Number.isInteger(comentarioId) || comentarioId <= 0) {
      res.status(400).json({ ok: false, mensaje: "ID inválido." });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const r = await client.query<CommentRecord>(
        "SELECT * FROM public.comments WHERE id = $1",
        [comentarioId]
      );

      const c = r.rows.at(0);
      if (!c) {
        await client.query("ROLLBACK");
        res
          .status(404)
          .json({ ok: false, mensaje: "Comentario no encontrado." });
        return;
      }

      if (c.is_deleted) {
        await client.query("ROLLBACK");
        res
          .status(400)
          .json({ ok: false, mensaje: "Comentario ya eliminado." });
        return;
      }

      // Solo autor o admin
      if (user.id !== c.author_id && user.rol !== "admin") {
        await client.query("ROLLBACK");
        res.status(403).json({ ok: false, mensaje: "No autorizado." });
        return;
      }

      await client.query(
        "UPDATE public.comments SET is_deleted = true WHERE id = $1",
        [comentarioId]
      );

      // Intentar decrementar contador (si existe)
      try {
        await client.query(
          "UPDATE public.topicos SET comments_count = GREATEST(comments_count - 1, 0) WHERE id_topico = $1",
          [c.topico_id]
        );
      } catch {
        // Ignorar si la columna no existe
      }

      await client.query("COMMIT");
      res.json({ ok: true, mensaje: "Comentario eliminado." });
    } catch (err) {
      await client.query("ROLLBACK");
      next(err);
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}
  */
//# sourceMappingURL=comments.controller.js.map