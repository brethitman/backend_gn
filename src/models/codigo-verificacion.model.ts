export interface CodigoVerificacion {
  id: number;
  usuario_id: number;
  codigo: string;
  tipo: 'verificacion_email' | 'recuperacion_password';
  expiracion: Date;
  utilizado: boolean;
  created_at: Date;
}

export interface CrearCodigoVerificacionDTO {
  usuario_id: number;
  codigo: string;
  tipo: 'verificacion_email' | 'recuperacion_password';
  expiracion: Date;
}