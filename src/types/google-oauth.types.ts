//C:\Users\Ffcg\Videos\copi_google\GENERACION_DE_SOFTWARE\BACKEND_GS\src\types\google-oauth.types.ts

import { type Profile as PassportProfile } from "passport";

export interface GoogleProfile extends PassportProfile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string }>;
}

export interface GoogleUserPayload {
  usuario: {
    id_usuario: number;
    nombre_completo: string;
    correo: string;
    rol: "estudiante" | "docente" | "administrador";
    activo: boolean;
  };
  token: string;
}

export interface JwtPayload {
  sub: string;
  rol: string;
  correo: string;
  iat?: number;
  exp?: number;
}

export interface UsuarioBase {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  rol: "estudiante" | "docente" | "administrador";
  activo: boolean;
}

export interface UsuarioConGoogle extends UsuarioBase {
  google_id: string | null;
}
