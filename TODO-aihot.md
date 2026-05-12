# MyAIHOT 部署待办清单

> 在 SOLO.X 仓库内继续完成部署。按顺序执行。

---

## 1. Neon PostgreSQL 数据库

- [ ] 创建 Neon 项目（https://neon.tech）
- [ ] 获取连接串（asyncpg 格式：`postgresql+asyncpg://user:pass@ep-xxx.neon.tech/myaihot?sslmode=require`）
- [ ] 在 Neon SQL Editor 执行：`CREATE EXTENSION IF NOT EXISTS vector;`

## 2. Python Worker 部署（Fly.io）

- [ ] `cd /Users/rustyryan/Desktop/files/myaihot-worker`
- [ ] 安装 Fly CLI：`brew install flyctl`（如未安装）
- [ ] 登录：`flyctl auth login`
- [ ] 创建应用：`flyctl apps create myaihot-worker`
- [ ] 创建持久卷：`flyctl volumes create model_cache --region sin --size 1`
- [ ] 设置 secrets：
  ```
  flyctl secrets set \
    DATABASE_URL="postgresql+asyncpg://user:pass@ep-xxx.neon.tech/myaihot?sslmode=require" \
    ANTHROPIC_API_KEY="sk-ant-xxxxx" \
    WORKER_API_KEY="生成一个随机密钥"
  ```
- [ ] 部署：`flyctl deploy`
- [ ] 验证：`curl https://myaihot-worker.fly.dev/health`
- [ ] 运行迁移：`flyctl ssh console --command "alembic upgrade head"`
- [ ] 导入信源：`flyctl ssh console --command "python scripts/seed_sources.py"`

## 3. SOLO.X 环境变量（Vercel）

- [ ] 在 Vercel Dashboard → SOLO.X 项目 → Settings → Environment Variables 添加：
  ```
  DATABASE_URL      = postgresql://user:pass@ep-xxx.neon.tech/myaihot?sslmode=require
  WORKER_API_URL    = https://myaihot-worker.fly.dev
  WORKER_API_KEY    = （与 Worker 的 WORKER_API_KEY 一致）
  CRON_SECRET       = 生成一个随机密钥
  ```
- [ ] 可选（保护写操作）：`AIHOT_ADMIN_PASSWORD`

## 4. SOLO.X 推送部署

- [ ] 检查改动：`git diff main --stat`
- [ ] 推送：`git push origin main`
- [ ] Vercel 自动部署，观察 build log
- [ ] 验证：访问 `https://你的域名/webapps/aihot/featured`

## 5. 验证完整流水线

- [ ] 手动触发 Cron 端点测试：
  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" \
    https://你的域名/api/aihot/cron/pipeline
  ```
- [ ] 检查 Worker 日志：`flyctl logs`
- [ ] 查看精选页是否有数据：`/webapps/aihot/featured`
- [ ] 手动触发日报：
  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" \
    https://你的域名/api/aihot/cron/daily-report
  ```

## 6. 功能开关（可选）

- [ ] 如果需要功能开关，在 Vercel 添加：`NEXT_PUBLIC_FEATURE_AIHOT=true`
- [ ] 在 `app/(site)/webapps/page.tsx` 中添加 aihot 入口卡片链接

---

## 关键文件位置

| 文件 | 用途 |
|------|------|
| `/Users/rustyryan/Desktop/files/myaihot-worker/` | Python Worker 仓库 |
| `docs/MyAIHOT_ArchitectureAdaptation.md` | 架构适配说明 |
| `docs/SOLOX_DesignTokens.md` | SOLO.X 设计令牌 |
| `docs/superpowers/plans/2026-05-12-myaihot-worker.md` | Worker 实现计划 |
| `docs/superpowers/plans/2026-05-12-myaihot-nextjs.md` | Next.js 实现计划 |
