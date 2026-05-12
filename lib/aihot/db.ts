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
  if (!s) {
    throw new Error("DATABASE_URL is not configured");
  }
  return s(strings, ...values);
}) as ReturnType<typeof neon>;

export async function ensureSchema(): Promise<void> {
  if (_schemaReady) return;

  const s = getSql();
  if (!s) {
    throw new Error("DATABASE_URL is not configured");
  }

  // Execute schema creation statements individually
  await s`CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL UNIQUE,
    feed_type VARCHAR(10) NOT NULL DEFAULT 'rss',
    tier VARCHAR(2) NOT NULL DEFAULT 'T2',
    category VARCHAR(50) NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT true,
    fetch_interval_minutes INTEGER NOT NULL DEFAULT 120,
    last_fetched_at TIMESTAMPTZ,
    success_count INTEGER NOT NULL DEFAULT 0,
    fail_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await s`CREATE TABLE IF NOT EXISTS contents (
    id SERIAL PRIMARY KEY,
    source_id INTEGER NOT NULL REFERENCES sources(id),
    url TEXT NOT NULL UNIQUE,
    url_hash VARCHAR(64) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    original_text TEXT,
    clean_text TEXT,
    language VARCHAR(5),
    published_at TIMESTAMPTZ,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duplicate_of INTEGER REFERENCES contents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await s`CREATE INDEX IF NOT EXISTS idx_contents_url_hash ON contents(url_hash)`;
  await s`CREATE INDEX IF NOT EXISTS idx_contents_fetched_at ON contents(fetched_at)`;

  await s`CREATE TABLE IF NOT EXISTS scored_contents (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL UNIQUE REFERENCES contents(id),
    score INTEGER NOT NULL,
    category VARCHAR(20) NOT NULL,
    summary_cn TEXT,
    translated_title VARCHAR(500),
    reason TEXT,
    keywords TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    featured_threshold INTEGER NOT NULL DEFAULT 65,
    scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    human_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  await s`CREATE INDEX IF NOT EXISTS idx_scored_featured ON scored_contents(is_featured, score DESC)`;
  await s`CREATE INDEX IF NOT EXISTS idx_scored_category ON scored_contents(category)`;

  await s`CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(10) NOT NULL,
    report_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content_json JSONB NOT NULL DEFAULT '{}',
    stats_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(report_type, report_date)
  )`;

  await s`CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL REFERENCES contents(id),
    note TEXT,
    tags TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(content_id)
  )`;

  await s`CREATE TABLE IF NOT EXISTS human_feedback (
    id SERIAL PRIMARY KEY,
    scored_content_id INTEGER NOT NULL REFERENCES scored_contents(id),
    feedback_type VARCHAR(20) NOT NULL,
    comment TEXT,
    suggested_score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;

  _schemaReady = true;
}
