import { Request, Response, NextFunction } from "express";
import { z } from "zod";
export declare const RegistroSchema: z.ZodObject<{
    nombre: z.ZodString;
    correo: z.ZodString;
    contrasena: z.ZodString;
    rol: z.ZodDefault<z.ZodEnum<{
        estudiante: "estudiante";
        docente: "docente";
        administrador: "administrador";
    }>>;
}, z.core.$strip>;
export declare function validarRegistro(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validacion.middleware.d.ts.map