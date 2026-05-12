# 计划：MyAIHOT Worker 逻辑迁移到 Next.js

## 背景

Python Worker 原计划部署到 Fly.io，但用户不愿绑卡。将其核心逻辑迁移到现有 Next.js cron API 路由中，利用 Vercel Cron + Neon PostgreSQL 完成全部工作，零额外成本。

## 约束

- **不用任何 OpenAI API**（包括 embedding）
- **不用 Fly.io / Railway 等外部托管**
- 语义去重改用 URL SHA256 + 标题 Jaccard 相似度
- Vercel Hobby 计划 Serverless Function 超时 10s，Pro 为 60s
- 所有评分/报告生成使用 Anthropic API（已有 ANTHROPIC_API_KEY）

## 架构

```
Vercel Cron (每2h) → /api/aihot/cron/pipeline
                       ├─ fetcher.ts    → 抓取 27 个 RSS/HTML 信源
                       ├─ dedupe.ts     → URL hash + 标题相似度去重
                       ├─ scorer.ts     → Anthropic API 批量评分
                       └─ 写入 Neon PostgreSQL

Vercel Cron (每日23:00) → /api/aihot/cron/daily-report
                            └─ report-builder.ts → 聚合 + LLM 生成叙事

Vercel Cron (每周日23:30) → /api/aihot/cron/weekly-report
                              └─ report-builder.ts → 聚合 + LLM 生成叙事
```

## 数据库 Schema

保持与 Python Worker 兼容，便于未来切换。去掉 embedding 列（384维向量），其余不变：

```sql
-- sources 表（已有，由 seed 脚本填充）
-- contents 表（去掉 embedding 列，保留 url_hash 用于去重）
-- scored_contents 表（不变）
-- reports 表（不变）
-- favorites 表（不变）
-- human_feedback 表（新增）
```

## 任务清单

### Phase 1：基础设施

#### T1. 数据库 Schema 初始化脚本
- 文件：`lib/aihot/schema.sql`
- 创建 sources / contents / scored_contents / reports / favorites / human_feedback 6 张表
- 去掉 pgvector 依赖，用 url_hash (VARCHAR) 替代 embedding
- 提供一个可重复执行的 CREATE IF NOT EXISTS 脚本

#### T2. 信源种子数据脚本
- 文件：`lib/aihot/seed-sources.ts` + `scripts/aihot-seed.ts`
- 把 Python Worker 的 27 个信源（seed_sources.py）转为 TypeScript
- 支持命令行运行：`npx tsx scripts/aihot-seed.ts`
- INSERT ON CONFLICT DO NOTHING

#### T3. Neon 连接验证
- 文件：`lib/aihot/db.ts`（已有，需小改）
- 添加 `ensureSchema()` 函数，启动时自动建表

### Phase 2：核心服务

#### T4. RSS/HTML 信源抓取服务
- 文件：`lib/aihot/fetcher.ts`
- 依赖：无需额外 npm 包，用原生 `fetch` + `DOMParser`（或 `fast-xml-parser`）
- 功能：
  - 并发抓取所有 active 信源（concurrency=5）
  - 解析 RSS 2.0 / Atom / HTML 页面
  - 提取标题、URL、正文、发布时间
  - 计算 url_hash（SHA256）用于去重
  - 更新 sources 表的 last_fetched_at / success_count / fail_count
- 安装：`npm install fast-xml-parser`（轻量 XML 解析）

#### T5. 去重服务
- 文件：`lib/aihot/dedupe.ts`
- URL 级：SHA256 hash 与 contents.url_hash 比对
- 标题级：Jaccard 相似度（分词后集合交集/并集），阈值 0.6
- 只检查近 48 小时的内容

#### T6. LLM 评分服务
- 文件：`lib/aihot/scorer.ts`
- 使用 `@anthropic-ai/sdk`（需安装）
- 批量评分：每批 5 条内容，单次 API 调用
- Prompt 模板从 Python Worker scorer.py 移植
- 评分维度：score(0-100) / category(5类) / summary_cn / keywords / is_featured
- 写入 scored_contents 表

#### T7. 报告生成服务
- 文件：`lib/aihot/report-builder.ts`
- 日报：聚合当日 scored_contents，按分类组织
- 周报：聚合当周 scored_contents
- LLM 生成叙事摘要（summary）
- 写入 reports 表

### Phase 3：Cron 路由接入

#### T8. 重写 pipeline cron 路由
- 文件：`app/api/aihot/cron/pipeline/route.ts`
- 当前是代理到外部 Worker，改为直接调用本地服务
- 流程：fetcher → dedupe → scorer → 写库
- 超时处理：如果抓取 27 源超时，分批处理（每批 5 源，单次 cron 只处理一批）

#### T9. 重写 daily-report cron 路由
- 文件：`app/api/aihot/cron/daily-report/route.ts`
- 调用 report-builder 生成日报

#### T10. 重写 weekly-report cron 路由
- 文件：`app/api/aihot/cron/weekly-report/route.ts`
- 调用 report-builder 生成周报

### Phase 4：验证

#### T11. 本地集成测试
- 配置 .env.local 的 DATABASE_URL
- 手动触发 pipeline：`curl localhost:3000/api/aihot/cron/pipeline`
- 验证 featured 页展示数据
- 验证日报/周报生成

#### T12. 构建验证 + 推送
- `npm run build` 通过
- 推送到 main，Vercel 自动部署
- 更新 TODO-2026-05-12.md

## 新增依赖

```
fast-xml-parser    # RSS/Atom XML 解析（~30KB，零依赖）
@anthropic-ai/sdk  # Anthropic API 客户端
```

## 超时策略

Vercel Hobby 计划 10s 超时是主要风险。策略：

1. **Pipeline 分批执行**：cron 每 2 小时触发，每次只抓取一批 5 个信源，轮询所有源需要 ~10 次 cron 周期
2. **标记已处理源**：sources 表记录 last_fetched_at，pipeline 只抓取距上次 > fetch_interval_minutes 的源
3. **评分延迟**：抓取和评分拆开，pipeline 只做抓取+去重+入库，评分由独立 cron 触发
4. 如果用户升级到 Vercel Pro（60s），可一次性处理更多源

## 文件变更清单

| 操作 | 文件 |
|------|------|
| 新增 | `lib/aihot/schema.sql` |
| 新增 | `lib/aihot/seed-sources.ts` |
| 新增 | `scripts/aihot-seed.ts` |
| 新增 | `lib/aihot/fetcher.ts` |
| 新增 | `lib/aihot/dedupe.ts` |
| 新增 | `lib/aihot/scorer.ts` |
| 新增 | `lib/aihot/report-builder.ts` |
| 修改 | `lib/aihot/db.ts` |
| 重写 | `app/api/aihot/cron/pipeline/route.ts` |
| 重写 | `app/api/aihot/cron/daily-report/route.ts` |
| 重写 | `app/api/aihot/cron/weekly-report/route.ts` |
