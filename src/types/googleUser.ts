export interface AuthUser {
  id: number;
  rol: "admin" | "docente" | "editor" | "estudiante";
  nombre: string;
  correo: string;
}

export interface GoogleAuthUser {
  googleId?: string;
  email?: string;
  name?: string;
  photo?: string;
}

export type GoogleReq = import("express").Request & {
  user?: Partial<AuthUser & GoogleAuthUser>;
};
