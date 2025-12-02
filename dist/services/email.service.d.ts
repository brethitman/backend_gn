export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare class EmailService {
    private transporter;
    constructor();
    enviarEmail(opciones: EmailOptions): Promise<void>;
    generarTemplateVerificacion(codigo: string, nombreUsuario: string): string;
}
//# sourceMappingURL=email.service.d.ts.map