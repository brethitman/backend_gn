import type { Request, Response } from "express";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { buscarPorCorreo, crearUsuario } from "../repositories/usuarios.repo";

interface Usuario {
  id: string | number;
  nombre: string;
  correo: string;
  rol: string;
}

function firmarJWT(payload: { sub: string; rol: string; correo: string }): string {
  const secret: Secret = process.env.JWT_SECRETO as string;
  const exp = process.env.JWT_EXPIRES;
  const expiresIn: SignOptions["expiresIn"] =
    exp && !Number.isNaN(Number(exp)) ? Number(exp) : 10800;
  return jwt.sign(payload, secret, { expiresIn });
}

export async function callbackGoogle(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as { email?: string; name?: string } | undefined;
    if (!user?.email) {
      const front = new URL("http://localhost:5173/");
      front.searchParams.set("error", "google_auth_failed");
      res.redirect(front.toString());
      return;
    }

    const email = user.email;
    const name = user.name ?? "";

    let usuario = (await buscarPorCorreo(email)) as Usuario | null;
    if (!usuario) {
      usuario = (await crearUsuario({
        nombre: name,
        correo: email,
        contrasenaHash: "", // marcador para cuentas Google
        rol: "estudiante",
      })) as Usuario;
    }

    const token = firmarJWT({
      sub: String(usuario.id),
      rol: usuario.rol,
      correo: usuario.correo,
    });

    // Redirige al front con token y datos
    const urlFront = new URL("http://localhost:5173/login/");
    urlFront.searchParams.set("token", token);
    urlFront.searchParams.set("nombre", usuario.nombre);
    urlFront.searchParams.set("correo", usuario.correo);

    res.redirect(urlFront.toString());
  } catch (err) {
    console.error("[callbackGoogle] Error:", err);
    const front = new URL("http://localhost:5173/");
    front.searchParams.set("error", "google_auth_failed");
    res.redirect(front.toString());
  }
}
