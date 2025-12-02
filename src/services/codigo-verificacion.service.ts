import { CodigoVerificacionRepository } from '../repositories/codigo-verificacion.repo';

import { EmailService } from './email.service';

export class CodigoVerificacionService {
  private codigoRepo: CodigoVerificacionRepository;
  private emailService: EmailService;

  constructor() {
    this.codigoRepo = new CodigoVerificacionRepository();
    this.emailService = new EmailService();
  }

  generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  calcularExpiracion(minutos: number = 15): Date {
    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() + minutos);
    return fecha;
  }

  async enviarCodigoVerificacion(
    email: string, 
    nombreUsuario: string, 
    usuarioId: number
  ): Promise<string> {
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

  async verificarCodigo(codigo: string, usuarioId: number): Promise<boolean> {
    const codigoVerificacion = await this.codigoRepo.buscarPorCodigo(codigo, 'verificacion_email');
    
    if (!codigoVerificacion || codigoVerificacion.usuario_id !== usuarioId) {
      return false;
    }

    // Marcar código como utilizado
    await this.codigoRepo.marcarComoUtilizado(codigoVerificacion.id);
    return true;
  }
}