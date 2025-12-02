import { Request, Response } from "express";
export declare function obtenerCursos(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function obtenerCursoPorId(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function crearCursoController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function actualizarCursoController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function eliminarCursoController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function obtenerCursoConTopicos(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=cursos.controller.d.ts.map