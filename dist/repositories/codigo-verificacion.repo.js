"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodigoVerificacionRepository = void 0;
const db_1 = require("../infrastructure/db");
class CodigoVerificacionRepository {
    async crear(datos) {
        const query = `
      INSERT INTO codigos_verificacion (usuario_id, codigo, tipo, expiracion)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const values = [datos.usuario_id, datos.codigo, datos.tipo, datos.expiracion];
        const result = await (0, db_1.ejecutarConsulta)(query, values);
        // ✅ Verificar que existe el resultado
        if (!result.rows[0]) {
            throw new Error('No se pudo crear el código de verificación');
        }
        return result.rows[0];
    }
    async buscarPorCodigo(codigo, tipo) {
        const query = `
      SELECT * FROM codigos_verificacion 
      WHERE codigo = $1 AND tipo = $2 AND utilizado = false AND expiracion > NOW()
    `;
        const result = await (0, db_1.ejecutarFilas)(query, [codigo, tipo]);
        return result[0] || null;
    }
    async marcarComoUtilizado(id) {
        const query = 'UPDATE codigos_verificacion SET utilizado = true WHERE id = $1';
        await (0, db_1.ejecutarConsulta)(query, [id]);
    }
    async eliminarCodigosExpirados() {
        const query = 'DELETE FROM codigos_verificacion WHERE expiracion < NOW()';
        await (0, db_1.ejecutarConsulta)(query);
    }
}
exports.CodigoVerificacionRepository = CodigoVerificacionRepository;
//# sourceMappingURL=codigo-verificacion.repo.js.map