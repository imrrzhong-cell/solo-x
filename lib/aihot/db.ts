import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!_sql && process.env.DATABASE_URL) {
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
  const s = getSql();
  if (!s) {
    throw new Error("DATABASE_URL is not configured");
  }
  return s(strings, ...values);
}) as ReturnType<typeof neon>;
