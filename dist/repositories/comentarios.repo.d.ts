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
export declare function obtenerComentarioPorTopico(idTopico: string): Promise<Comentario | null>;
export declare function crearComentarioPrincipal(params: {
    idTopico: string;
    idUsuario: string;
    texto: string;
}): Promise<any>;
export declare function crearRespuesta(params: {
    idComentario: string;
    idUsuario: string;
    texto: string;
}): Promise<any>;
//# sourceMappingURL=comentarios.repo.d.ts.map