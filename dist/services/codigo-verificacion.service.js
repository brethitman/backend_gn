"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodigoVerificacionService = void 0;
const codigo_verificacion_repo_1 = require("../repositories/codigo-verificacion.repo");
const email_service_1 = require("./email.service");
class CodigoVerificacionService {
    constructor() {
        this.codigoRepo = new codigo_verificacion_repo_1.CodigoVerificacionRepository();
        this.emailService = new email_service_1.EmailService();
    }
    generarCodigo() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    calcularExpiracion(minutos = 15) {
        const fecha = new Date();
        fecha.setMinutes(fecha.getMinutes() + minutos);
        return fecha;
    }
    async enviarCodigoVerificacion(email, nombreUsuario, usuarioId) {
        const codigo = this.generarCodigo();
        const expiracion = this.calcularExpiracion();
        // Guardar código en la base de datos
        await this.codigoRepo.crear({
            usuario_id: usuarioId,
            codigo,
            tipo: 'verificacion_email',
            expiracion,
        });
        // Enviar email
        const html = this.emailService.generarTemplateVerificacion(codigo, nombreUsuario);
        await this.emailService.enviarEmail({
            to: email,
            subject: 'Verifica tu correo electrónico',
            html,
        });
        return codigo;
    }
    async verificarCodigo(codigo, usuarioId) {
        const codigoVerificacion = await this.codigoRepo.buscarPorCodigo(codigo, 'verificacion_email');
        if (!codigoVerificacion || codigoVerificacion.usuario_id !== usuarioId) {
            return false;
        }
        // Marcar código como utilizado
        await this.codigoRepo.marcarComoUtilizado(codigoVerificacion.id);
        return true;
    }
}
exports.CodigoVerificacionService = CodigoVerificacionService;
//# sourceMappingURL=codigo-verificacion.service.js.map