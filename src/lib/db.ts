/**
 * Minimal tagged-template SQL client for local typecheck / preview.
 * Production platforms may inject a real getSql implementation.
 */
import pg from "pg";

type SqlTagged = {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<Record<string, unknown>[]>;
};

let pool: pg.Pool | null = null;

function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!pool) {
    pool = new pg.Pool({ connectionString: url, max: 4 });
  }
  return pool;
}

export async function getSql(): Promise<SqlTagged> {
  const p = getPool();
  const sql: SqlTagged = async (strings, ...values) => {
    let text = "";
    const params: unknown[] = [];
    for (let i = 0; i < strings.length; i++) {
      text += strings[i];
      if (i < values.length) {
        params.push(values[i]);
        text += `$${params.length}`;
      }
    }
    const result = await p.query(text, params);
    return result.rows as Record<string, unknown>[];
  };
  return sql;
}
