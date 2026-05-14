import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;
let _schemaReady = false;

function getSql() {
  if (!_sql && process.env.DATABASE_URL) {
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

export const sql = ((strings: TemplateStringsArray, ...values: unknown[]) => {
  const s = getSql();
  if (!s) throw new Error("DATABASE_URL is not configured");
  return s(strings, ...values);
}) as ReturnType<typeof neon>;

export async function ensureArticleSchema(): Promise<void> {
  if (_schemaReady) return;
  const s = getSql();
  if (!s) throw new Error("DATABASE_URL is not configured");

  await s`CREATE TABLE IF NOT EXISTS generated_articles (
    id SERIAL PRIMARY KEY,
    article_type VARCHAR(30) NOT NULL,
    article_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    summary TEXT,
    content_md TEXT NOT NULL,
    source_count INTEGER DEFAULT 0,
    top_items JSONB,
    status VARCHAR(10) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_type, article_date)
  )`;

  await s`CREATE INDEX IF NOT EXISTS idx_gen_articles_type_date ON generated_articles(article_type, article_date DESC)`;
  await s`CREATE INDEX IF NOT EXISTS idx_gen_articles_latest ON generated_articles(created_at DESC)`;

  _schemaReady = true;
}
