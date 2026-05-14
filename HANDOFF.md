# 2026-05-12 MyAIHOT 部署接力记录

## 当前目标

按 `TODO-2026-05-12.md` 完成 MyAIHOT 的 Neon 数据库、Fly.io worker、Vercel 环境变量和部署后验证。

## 已完成

- 已在 Neon 创建项目，区域为 Singapore / `ap-southeast-1`。
- 已取得 Neon PostgreSQL 连接串，数据库名为 `neondb`。
- 已在 Neon SQL Editor 执行 `CREATE EXTENSION IF NOT EXISTS vector;`，页面返回 `Statement executed successfully`。
- 用户决定使用智谱 BigModel API Key，而不是 Anthropic Key。
- 已修改 `/Users/rustyryan/Desktop/files/myaihot-worker/` 的 worker 代码，使其在设置 `ZHIPU_API_KEY` 时通过智谱 OpenAI-compatible chat completions 调用模型，同时保留 Anthropic fallback。
- 已跑 worker 测试：`51 passed, 2 warnings`。

## 已改文件

- `/Users/rustyryan/Desktop/files/myaihot-worker/app/config.py`
- `/Users/rustyryan/Desktop/files/myaihot-worker/app/services/llm_client.py`
- `/Users/rustyryan/Desktop/files/myaihot-worker/app/services/scorer.py`
- `/Users/rustyryan/Desktop/files/myaihot-worker/app/services/report_builder.py`
- `/Users/rustyryan/Desktop/files/myaihot-worker/.env.example`
- `/Users/rustyryan/Desktop/files/myaihot-worker/tests/test_config.py`
- 本文件：`HANDOFF.md`

## 验证命令

```bash
cd /Users/rustyryan/Desktop/files/myaihot-worker
. .venv/bin/activate && pytest
```

结果：`51 passed, 2 warnings`。

## 当前状态 / 阻塞

- 正在安装 Fly CLI。此前 GitHub 下载多次超时；用户已清理其它下载任务后重新尝试，目前官方安装脚本开始下载但速度较慢。
- 还未完成 Fly 登录、app 创建/确认、volume 创建、secrets 设置、deploy、health check、迁移和 seed。
- 还未完成 Vercel 环境变量设置。

## 需要继续执行

1. 确认 `flyctl` 安装完成：`/Users/rustyryan/.fly/bin/flyctl version`。
2. 如未登录，执行 `flyctl auth login` 并用本机 Chrome 完成登录。
3. 在 `/Users/rustyryan/Desktop/files/myaihot-worker`：
   - 确认或创建 app：`flyctl apps create myaihot-worker`
   - 创建 volume：`flyctl volumes create model_cache --region sin --size 1`
   - 设置 secrets：
     - `DATABASE_URL` 使用 Neon 连接串，协议改为 `postgresql+asyncpg://`
     - `ZHIPU_API_KEY` 使用用户提供的智谱 Key
     - `ZHIPU_BASE_URL=https://open.bigmodel.cn/api/paas/v4`
     - `WORKER_API_KEY` 使用本轮生成的随机值
     - `SCORING_MODEL=glm-4-flash`
     - `REPORT_MODEL=glm-4-flash`
   - `flyctl deploy`
   - `curl https://myaihot-worker.fly.dev/health`
   - `flyctl ssh console --command "alembic upgrade head"`
   - `flyctl ssh console --command "python scripts/seed_sources.py"`
4. 给 Vercel 项目 `solo-x` 配置：
   - `DATABASE_URL` 使用 Neon 原始 Node.js 格式连接串
   - `WORKER_API_URL=https://myaihot-worker.fly.dev`
   - `WORKER_API_KEY` 与 Fly 相同
   - `CRON_SECRET` 使用本轮生成的随机值
5. 部署后用 `CRON_SECRET` 触发：
   - `/api/aihot/cron/pipeline`
   - `/api/aihot/cron/daily-report`

## 注意

- 不要把真实数据库密码、智谱 Key、worker key、cron secret 写入提交或最终回复。
- 主项目中文优先；UI/文档默认中文。
