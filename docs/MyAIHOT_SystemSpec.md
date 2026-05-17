# MyAIHOT 系统规格文档

> 最后更新：2026-05-13
> 源码位置：`lib/aihot/`

---

## 一、信源清单（24 个活跃源）

### T1 官方（8 个）

| 名称 | URL | 抓取频率 |
|------|-----|----------|
| OpenAI Blog | `openai.com/blog/rss.xml` | 120min |
| Anthropic Blog | `anthropic.com/feed.xml` | 120min |
| Google AI Blog | `blog.google/technology/ai/rss/` | 120min |
| DeepMind Blog | `blog.google/technology/ai/rss/` | 120min |
| Meta AI Blog | `about.fb.com/news/feed/` | 120min |
| Apple Machine Learning | `machinelearning.apple.com/rss.xml` | 180min |
| Microsoft Research | `microsoft.com/en-us/research/feed/` | 180min |
| Hugging Face Blog | `huggingface.co/blog/feed.xml` | 120min |

### T1 媒体（5 个）

| 名称 | URL | 抓取频率 |
|------|-----|----------|
| MIT Technology Review | `technologyreview.com/feed/` | 180min |
| VentureBeat AI | `venturebeat.com/category/ai/feed/` | 120min |
| The Verge AI | `theverge.com/rss/ai-artificial-intelligence/index.xml` | 120min |
| Ars Technica AI | `feeds.arstechnica.com/arstechnica/features` | 180min |
| WIRED | `wired.com/feed/rss` | 180min |

### T1 学术（2 个）

| 名称 | URL | 抓取频率 |
|------|-----|----------|
| ArXiv cs.AI | `rss.arxiv.org/rss/cs.AI` | 360min |
| ArXiv cs.LG | `rss.arxiv.org/rss/cs.LG` | 360min |

### T2 社区（3 个）

| 名称 | URL | 抓取频率 |
|------|-----|----------|
| Hacker News AI | `hnrss.org/newest?q=AI+artificial+intelligence` | 60min |
| Reddit r/MachineLearning | `old.reddit.com/r/MachineLearning/.rss` | 120min |
| Reddit r/artificial | `old.reddit.com/r/artificial/.rss` | 120min |

### T1 中文（4 个）

| 名称 | URL | 抓取频率 |
|------|-----|----------|
| 量子位 | `qbitai.com/feed` | 120min |
| 机器之心 | `jiqizhixin.com/rss` | 120min |
| AI科技评论 | `leiphone.com/feed` | 180min |
| 少数派 AI | `sspai.com/feed` | 240min |

### T2 博客（3 个）

| 名称 | URL | 抓取频率 |
|------|-----|----------|
| Andrej Karpathy | `karpathy.github.io/feed.xml` | 360min |
| The Gradient | `thegradient.pub/rss/` | 360min |
| Ahead of AI | `magazine.sebastianraschka.com/feed` | 360min |

---

## 二、信源分级规则

- **T1**：高质量核心源，官方博客、顶级媒体、核心学术源
- **T2**：补充源，社区讨论、个人博客
- Pipeline 抓取排序：`ORDER BY tier ASC`，T1 优先
- `fetch_interval_minutes`：不同信源的抓取间隔，避免高频抓取被屏蔽

---

## 三、数据流水线（Pipeline）

### 执行流程

```
Cron 触发 → ensureSchema() → 查询到期信源 → fetchSources() → deduplicate() → saveScoredItems() → 返回统计
```

### Cron 调度（Vercel Cron）

| 任务 | 调度 | 说明 |
|------|------|------|
| pipeline | `0 0 * * *`（每日 00:00 UTC） | 抓取+去重+评分 |
| daily-report | `0 23 * * *`（每日 23:00 UTC） | 生成日报 |
| weekly-report | `30 23 * * 0`（周日 23:30 UTC） | 生成周报 |

### 到期信源选择

```sql
WHERE active = true
  AND (last_fetched_at IS NULL
       OR last_fetched_at < NOW() - (fetch_interval_minutes || ' minutes')::interval)
ORDER BY tier ASC, last_fetched_at ASC NULLS FIRST
```

从未抓取的优先，然后按间隔到期、T1 优先。

---

## 四、信息抽取规则

### RSS 解析（fetcher.ts）

支持三种格式：
1. **RSS 2.0**：`rss.channel.item[]` → title, link, description/content:encoded, pubDate
2. **Atom**：`feed.entry[]` → title, link(href), summary/content, published/updated
3. **RSS 1.0 (RDF)**：`rdf:RDF.item[]` → 兼容 ArXiv 等学术源

### 字段提取

| 字段 | 提取规则 |
|------|----------|
| url | Atom 需处理 `link` 对象的 `@_href` 属性；RSS 直接取 `link` 字符串 |
| title | 支持 `title` 为对象时取 `#text` |
| 正文 | 优先 `content:encoded`，其次 `content`、`description`、`summary` |
| 发布时间 | 尝试 `pubDate`、`published`、`updated` 三个字段 |
| 正文截取 | 原始文本保留前 5000 字符，清洗文本保留前 2000 字符 |

### HTML 清洗（stripHtml）

- 移除所有 HTML 标签
- 解码常见 HTML 实体（&amp; &lt; &gt; &quot; &#39; &nbsp;）
- 合并多余空白

### 语言检测

```
CJK 字符占比 > 10% → "zh"，否则 → "en"
```

检测范围覆盖 CJK 统一汉字（一-鿿）、平假名、片假名。

### 时效过滤

- **只接收最近 7 天内发布的文章**
- 有 `published_at` 且超过 7 天 → 直接跳过
- 无 `published_at` → 保留（无法确认时效，假定新鲜）

### XML 合法性校验

响应必须以 `<?xml`、`<rss`、`<feed` 或 `<rdf` 开头，否则视为非 XML 响应并报错。

### HTTP 请求参数

- 超时：15 秒（AbortController）
- User-Agent：`Mozilla/5.0 (compatible; MyAIHOT/1.0; +https://solo-x.vercel.app)`
- Accept：`application/rss+xml, application/atom+xml, application/xml, text/xml, */*`
- 并发控制：最多 5 个并发 worker

---

## 五、去重规则（dedupe.ts）

### 两层去重

**第一层：URL Hash 去重**
- 对 URL 做 SHA256 哈希 → `url_hash`
- 与数据库中已有 `contents.url_hash` 比对
- 完全匹配则丢弃

**第二层：标题相似度去重**
- 分词：英文按空格切分，中文按字符级切分（正则 `[^\w一-鿿]`），过滤长度 ≤1 的 token
- 计算 Jaccard 相似度：`|A ∩ B| / |A ∪ B|`
- 阈值：**0.6**（超过 60% 相似则视为重复）
- 比对范围：**近 48 小时**内已入库的标题

### URL Hash 算法

```typescript
SHA256(url string) → 64 位十六进制字符串
```

---

## 六、评分规则（scorer.ts）

### LLM 模型

- 默认模型：**智谱 GLM-4-Flash**
- 可通过环境变量 `SCORING_MODEL` 覆盖
- API 端点：`https://open.bigmodel.cn/api/paas/v4/chat/completions`

### 评分维度（5 维）

| 维度 | 说明 |
|------|------|
| 影响力 | 对 AI 行业的实际影响程度 |
| 新颖性 | 信息的新鲜度和独特性 |
| 深度 | 技术或分析的深度 |
| 实用性 | 对从业者的参考价值 |
| 时效性 | 发布越近分越高，超 7 天扣 30+ 分 |

### 输出字段

| 字段 | 说明 |
|------|------|
| score | 0-100 整数 |
| category | model / product / research / opinion / tool |
| summary_cn | 50-100 字中文摘要 |
| translated_title | 中文标题（英文翻译，中文保留） |
| reason | 10-20 字评分理由 |
| keywords | 3-5 个关键词，逗号分隔 |
| is_featured | score ≥ 65 **且**发布时间在 7 天内 → true |

### 批量评分

- 每批 **5 篇**文章，单次 API 调用
- 输入：标题 + URL + 正文前 500 字
- API max_tokens：2000

### 入库策略

- `contents` 表：`ON CONFLICT (url) DO NOTHING`（URL 唯一）
- `scored_contents` 表：`ON CONFLICT (content_id) DO NOTHING`（每篇只评一次）

---

## 七、分类体系

| key | 中文标签 | 说明 |
|-----|---------|------|
| model | 模型 | 新模型发布、架构更新、能力评测 |
| product | 产品 | AI 产品功能更新、新功能发布 |
| research | 研究 | 学术论文、技术突破、实验报告 |
| opinion | 观点 | 行业评论、趋势分析、观点文章 |
| tool | 工具 | 开发工具、SDK、API、框架 |

---

## 八、报告生成规则（report-builder.ts）

### 日报

- 数据范围：当日 `scored_at` 的精选内容（`is_featured = true`），最多 50 条
- AI 叙事：取 Top 20 条，生成 200-300 字中文综合分析
- 输出：标题 + 摘要 + 按分类组织的内容 JSON
- API max_tokens：1000

### 周报

- 数据范围：当周精选内容，最多 80 条
- AI 叙事：取 Top 30 条，生成 300-500 字中文综合分析
- API max_tokens：1500

### 报告存储

- `UPSERT` 模式：`ON CONFLICT (report_type, report_date) DO UPDATE`
- 同一天/周的报告可以重新生成覆盖

---

## 九、前端展示规则

### 精选页（featured）

- 查询条件：`is_featured = true` + `published_at >= NOW() - 7 days`
- 排序：`score DESC, published_at DESC`
- 分页：每页 20 条
- 支持分类筛选

### 全部动态页（all）

- 查询条件：`published_at >= NOW() - 30 days`
- 排序：`published_at DESC`
- 支持搜索（标题 + 摘要 ILIKE）和分类筛选
- 分页：每页 20 条

### 日报 / 周报

- 按日期/周查询 `reports` 表
- 近 7 天/8 周的日期选择器

### 统计页（stats）

- 今日抓取数（24h）
- 今日评分数（24h）
- 精选总数、活跃信源数、收藏数
- 分类分布（近 7 天）
- 信源健康度（成功率末位 10）
- 热门关键词（近 7 天，Top 30）

### 评分颜色映射

| 分数 | 颜色 |
|------|------|
| ≥ 90 | `--sage3`（深绿） |
| ≥ 70 | `--sage2`（中绿） |
| ≥ 50 | `--sage`（浅绿） |
| < 50 | `--char3`（灰色） |

---

## 十、数据库 Schema

6 张表，自动建表（`ensureSchema()` 在 pipeline 首次运行时执行）：

| 表 | 说明 | 关键字段 |
|----|------|----------|
| sources | 信源 | url(UNIQUE), tier, active, fetch_interval_minutes, success/fail_count |
| contents | 文章 | url(UNIQUE), url_hash(UNIQUE), title, clean_text, published_at |
| scored_contents | 评分 | content_id(UNIQUE FK), score, category, summary_cn, is_featured |
| reports | 报告 | report_type + report_date(UNIQUE), content_json(JSONB) |
| favorites | 收藏 | content_id(UNIQUE FK), tags |
| human_feedback | 反馈 | scored_content_id(FK), feedback_type, suggested_score |

---

## 十一、环境变量

| 变量 | 必需 | 说明 |
|------|------|------|
| `DATABASE_URL` | 是 | Neon PostgreSQL 连接串 |
| `ZHIPU_API_KEY` | 是 | 智谱大模型 API Key |
| `CRON_SECRET` | 是 | Cron 端点认证密钥 |
| `SCORING_MODEL` | 否 | 评分模型名，默认 `glm-4-flash` |
