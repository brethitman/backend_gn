import { Topico } from "./topico.repo";
export type Curso = {
    id: string;
    titulo: string;
    descripcion?: string | null;
    publicado: boolean;
    creadoEn: Date;
    creadoDesdeId?: string | null;
    topicos?: Topico[];
};
export declare function listarCursos(): Promise<Curso[]>;
export declare function buscarCursoPorId(id: string): Promise<Curso | null>;
export declare function crearCurso(params: {
    titulo: string;
    descripcion?: string | null;
    publicado?: boolean;
    creadoDesdeId?: string | null;
}): Promise<Curso>;
export declare function actualizarCurso(params: {
    id: string;
    titulo?: string;
    descripcion?: string | null;
    publicado?: boolean;
}): Promise<Curso | null>;
export declare function eliminarCurso(id: string): Promise<boolean>;
export declare function listarTopicosPorCurso(idCurso: string): Promise<Topico[]>;
export declare function buscarCursoConTopicos(idCurso: string): Promise<Curso | null>;
//# sourceMappingURL=cursos.repo.d.ts.map