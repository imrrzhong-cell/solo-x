export interface BizSource {
  id: number;
  name: string;
  url: string;
  tier: number;
  active: boolean;
  fetch_interval_minutes: number;
  last_fetched_at: string | null;
  success_count: number;
  fail_count: number;
  created_at: string;
}

export interface BizContent {
  id: number;
  source_id: number;
  url: string;
  url_hash: string;
  title: string;
  original_text: string | null;
  clean_text: string | null;
  language: string | null;
  published_at: string | null;
  created_at: string;
}

export interface BizOpportunity {
  id: number;
  content_id: number;
  is_business_case: boolean;
  project_name: string | null;
  target_audience: string | null;
  pain_point: string | null;
  business_model: string | null;
  revenue_hint: string | null;
  opc_fit_score: number | null;
  ecommerce_relevance_score: number | null;
  china_feasibility_score: number | null;
  revenue_verified: boolean | null;
  takeaways_cn: string | null;
  tags: string[] | null;
  analyzed_at: string;
  // joined fields
  url?: string;
  title?: string;
  published_at?: string | null;
  source_name?: string;
}

export interface BizReport {
  id: number;
  report_type: "daily";
  report_date: string;
  narrative: string | null;
  content_json: Record<string, unknown>;
  created_at: string;
}

export interface OpportunityCard extends BizOpportunity {
  url: string;
  title: string;
  published_at: string | null;
  source_name: string;
}

export type FilterType = "" | "feasible" | "money";

export interface PaginatedOpportunities {
  items: OpportunityCard[];
  total: number;
  page: number;
  pages: number;
}
