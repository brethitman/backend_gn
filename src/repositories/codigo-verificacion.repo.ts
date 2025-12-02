import { ejecutarConsulta, ejecutarFilas } from '../infrastructure/db';
import { CodigoVerificacion, CrearCodigoVerificacionDTO } from '../models/codigo-verificacion.model';

export class CodigoVerificacionRepository {
  async crear(datos: CrearCodigoVerificacionDTO): Promise<CodigoVerificacion> {
    const query = `
      INSERT INTO codigos_verificacion (usuario_id, codigo, tipo, expiracion)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [datos.usuario_id, datos.codigo, datos.tipo, datos.expiracion];
    const result = await ejecutarConsulta<CodigoVerificacion>(query, values);
    
    // ✅ Verificar que existe el resultado
    if (!result.rows[0]) {
      throw new Error('No se pudo crear el código de verificación');
    }
    
    return result.rows[0];
  }

  async buscarPorCodigo(codigo: string, tipo: string): Promise<CodigoVerificacion | null> {
    const query = `
      SELECT * FROM codigos_verificacion 
      WHERE codigo = $1 AND tipo = $2 AND utilizado = false AND expiracion > NOW()
    `;
    
    const result = await ejecutarFilas<CodigoVerificacion>(query, [codigo, tipo]);
    return result[0] || null;
  }

  async marcarComoUtilizado(id: number): Promise<void> {
    const query = 'UPDATE codigos_verificacion SET utilizado = true WHERE id = $1';
    await ejecutarConsulta(query, [id]);
  }

  async eliminarCodigosExpirados(): Promise<void> {
    const query = 'DELETE FROM codigos_verificacion WHERE expiracion < NOW()';
    await ejecutarConsulta(query);
  }
}