"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.ejecutarConsulta = ejecutarConsulta;
exports.ejecutarFilas = ejecutarFilas;
// src/infrastructure/db.ts
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Devuelve el QueryResult completo (rows, rowCount, etc.)
async function ejecutarConsulta(texto, parametros) {
    return exports.pool.query(texto, parametros);
}
// Si prefieres devolver solo las filas tipadas:
async function ejecutarFilas(texto, parametros) {
    const { rows } = await exports.pool.query(texto, parametros);
    return rows;
}
;
//# sourceMappingURL=db.js.map