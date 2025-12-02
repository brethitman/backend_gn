"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manejadorErrores = manejadorErrores;
function manejadorErrores(err, _req, res, _next) {
    console.error(err);
    // Convertimos err a AppError si tiene la forma correcta
    const error = err;
    const estado = typeof error.status === "number" ? error.status : 500;
    res.status(estado).json({
        ok: false,
        mensaje: error.message || "Error interno del servidor",
        code: error.code,
    });
}
//# sourceMappingURL=error.middleware.js.map