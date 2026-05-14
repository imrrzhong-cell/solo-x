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

export async function ensureBizSchema(): Promise<void> {
  if (_schemaReady) return;

  const s = getSql();
  if (!s) throw new Error("DATABASE_URL is not configured");

  await s`CREATE TABLE IF NOT EXISTS biz_sources (
    id SERIAL PRIMARY KEY,
    url VARCHAR(512) UNIQUE NOT NULL,
    name VARCHAR(100),
    tier INTEGER DEFAULT 2,
    active BOOLEAN DEFAULT true,
    fetch_interval_minutes INTEGER DEFAULT 1440,
    last_fetched_at TIMESTAMPTZ,
    success_count INTEGER DEFAULT 0,
    fail_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await s`CREATE TABLE IF NOT EXISTS biz_contents (
    id SERIAL PRIMARY KEY,
    source_id INTEGER REFERENCES biz_sources(id),
    url VARCHAR(512) UNIQUE NOT NULL,
    url_hash VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    original_text TEXT,
    clean_text TEXT,
    language VARCHAR(2),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await s`CREATE INDEX IF NOT EXISTS idx_biz_contents_url_hash ON biz_contents(url_hash)`;
  await s`CREATE INDEX IF NOT EXISTS idx_biz_contents_published ON biz_contents(published_at DESC)`;

  await s`CREATE TABLE IF NOT EXISTS biz_opportunities (
    id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES biz_contents(id) UNIQUE NOT NULL,
    is_business_case BOOLEAN NOT NULL DEFAULT false,
    project_name VARCHAR(255),
    target_audience VARCHAR(255),
    pain_point TEXT,
    business_model VARCHAR(255),
    revenue_hint VARCHAR(255),
    opc_fit_score INTEGER,
    ecommerce_relevance_score INTEGER,
    takeaways_cn TEXT,
    tags TEXT[],
    analyzed_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await s`CREATE INDEX IF NOT EXISTS idx_biz_opp_scores ON biz_opportunities(opc_fit_score DESC, ecommerce_relevance_score DESC)`;
  await s`CREATE INDEX IF NOT EXISTS idx_biz_opp_analyzed ON biz_opportunities(analyzed_at DESC)`;

  await s`CREATE TABLE IF NOT EXISTS biz_reports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(20) NOT NULL,
    report_date DATE NOT NULL,
    narrative TEXT,
    content_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(report_type, report_date)
  )`;

  _schemaReady = true;
}
