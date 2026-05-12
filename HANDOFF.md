# HANDOFF.md

## 当前目标

为 SOLO.X 个人网站设计一套长期运营方法：不引入复杂 CMS，以 AI 在代码层持续维护为核心，同时解决“用户很难直观指出要改哪里”的问题。用户已明确：stagewise 不可用，因此方案不能依赖 stagewise。

## 已完成工作

- 阅读了项目约束与架构：Next.js 16 + App Router + MDX + 自定义 CSS + Vercel 部署。
- 确认当前仓库适合“AI 直接改代码 + Git/Vercel 预览审核”的运营模式。
- 查看了关键文件：
  - `AGENTS.md`
  - `package.json`
  - `app/(site)/page.tsx`
  - `lib/features.ts`
  - `app/admin/command/command-panel.tsx`
  - `app/api/admin/command/route.ts`
  - `lib/admin/claude.ts`
- 已进行外部调研：Vercel Preview/Toolbar/Comments、Chrome DevTools MCP、Playwright MCP、Playwright visual comparison，以及 Tina/Decap/Payload 等 CMS 方向。

## 关键发现

- 当前站点的运营改动主要分为：MDX 内容、首页/页面文案、CSS 视觉样式、功能开关、订阅/表单配置、SEO/发布配置。
- 仓库已有 `npm run build`、`npm run lint`，但没有正式测试脚本；`package.json` 有 Playwright 依赖但未建立视觉回归流程。
- 本地 admin 指令中心目前调用的是 `claude` CLI，界面文案也是 Claude Code，不是 Codex。
- `AGENTS.md` 说明 admin 是本地工具，不应部署到生产。

## 命令和验证

- 已运行：
  - `rg --files`
  - `sed` / `nl` 查看关键文件
  - `git status --short`
  - `git diff -- middleware.ts`
- 未运行：
  - `npm run build`
  - `npm run lint`
  - dev server

## 当前状态/阻塞

- 这轮只做调研与方案，不做业务代码修改。
- 工作区已有非本轮创建的变更：
  - `middleware.ts` 已修改
  - `AGENTS.md` 未跟踪
  - `CLAUDE.md` 未跟踪
- 本轮新增文件：
  - `HANDOFF.md`

## 建议下一步

1. 先确认运营方案：stagewise 作为视觉指认层，Codex 作为主执行 agent，Vercel Preview/Comments 作为审核层，Playwright 截图回归作为上线保护。
2. 若用户同意，落地第一阶段：
   - 增加 `docs/AI-OPS.md` 运营手册，明确 Figma-first 工作流。
   - 建议建立一个 Figma 文件：`SOLO.X 运营设计板`，作为视觉修改、标注、归档入口。
   - 增加 `playwright.config.ts` 与关键页面截图检查。
   - 固化 Vercel Preview 作为最终验收层。
   - 将 admin 指令中心从 Claude 文案/调用改为 Codex 或明确标注为旧工具。
3. 不要覆盖用户现有的 `middleware.ts`、`AGENTS.md`、`CLAUDE.md` 变更。

## 风险/开放问题

- stagewise 不可用，不能再作为推荐路线。
- 用户强烈指出 Figma 更适合作为直观协作入口。更新后的推荐路线：
  - Figma：主视觉输入层，用于页面大改、模块设计、截图标注、移动端布局、设计归档。
  - Codex：代码执行层，把 Figma 意图落到 Next.js/CSS/MDX。
  - Vercel Preview：真实网页验收层，避免 Figma 与真实浏览器表现脱节。
  - Playwright：视觉回归保护层。
- 反方审视后的关键约束：Figma 不能成为唯一真相，也不应变成伪 CMS；代码仓库仍是内容和实现的 source of truth，Preview 是上线前最终验收。
