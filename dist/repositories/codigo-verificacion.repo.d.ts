import { CodigoVerificacion, CrearCodigoVerificacionDTO } from '../models/codigo-verificacion.model';
export declare class CodigoVerificacionRepository {
    crear(datos: CrearCodigoVerificacionDTO): Promise<CodigoVerificacion>;
    buscarPorCodigo(codigo: string, tipo: string): Promise<CodigoVerificacion | null>;
    marcarComoUtilizado(id: number): Promise<void>;
    eliminarCodigosExpirados(): Promise<void>;
}
//# sourceMappingURL=codigo-verificacion.repo.d.ts.map