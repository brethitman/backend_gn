
import type { Request, Response, NextFunction } from "express";
import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";

import app from "../app";

// 🔹 Mock del repositorio de autenticación
vi.mock("../repositories/autenticacion.repo", () => ({
  verificarUsuario: vi.fn(async (correo: string, contrasena: string) => {
    if (correo === "ana@example.com" && contrasena === "123456") {
      return {
        id_usuario: 1,
        nombre_completo: "Ana",
        correo,
        rol: "estudiante",
        activo: true,
        verificado: true,
      };
    }
    return null;
  }),
}));

// 🔹 Mock de passport para que no falle por Google OAuth
vi.mock("../config/passport.google", () => {
  return {
    default: {
      initialize: () => (req: Request, res: Response, next: NextFunction) => next(),
      session: () => (req: Request, res: Response, next: NextFunction) => next(),
    },
  };
});

describe("POST /api/v1/autenticacion/login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("400 si faltan campos requeridos", async () => {
    const res = await request(app)
      .post("/api/v1/autenticacion/login")
      .send({ correo: "ana@example.com" }); // sin contraseña
    expect(res.status).toBe(400);
  });

  it("200 y token con credenciales válidas", async () => {
    const res = await request(app)
      .post("/api/v1/autenticacion/login")
      .send({ correo: "ana@example.com", contrasena: "123456" });

    expect(res.status).toBe(200);

    expect(res.body.ok).toBe(true);
    expect(res.body.datos.usuario.correo).toBe("ana@example.com");
    expect(res.body.datos.token).toBeDefined(); // se genera JWT
  });

  it("401 con credenciales inválidas", async () => {
    const res = await request(app)
      .post("/api/v1/autenticacion/login")
      .send({ correo: "ana@example.com", contrasena: "zzz" });


    expect(res.status).toBe(401);
  });
});
