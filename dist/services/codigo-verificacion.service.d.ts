export declare class CodigoVerificacionService {
    private codigoRepo;
    private emailService;
    constructor();
    generarCodigo(): string;
    calcularExpiracion(minutos?: number): Date;
    enviarCodigoVerificacion(email: string, nombreUsuario: string, usuarioId: number): Promise<string>;
    verificarCodigo(codigo: string, usuarioId: number): Promise<boolean>;
}
//# sourceMappingURL=codigo-verificacion.service.d.ts.map