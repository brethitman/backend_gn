import { Pool, type QueryResult, type QueryResultRow } from "pg";
export declare const pool: Pool;
export declare function ejecutarConsulta<T extends QueryResultRow = QueryResultRow>(texto: string, parametros?: unknown[]): Promise<QueryResult<T>>;
export declare function ejecutarFilas<T extends QueryResultRow = QueryResultRow>(texto: string, parametros?: unknown[]): Promise<T[]>;
//# sourceMappingURL=db.d.ts.map