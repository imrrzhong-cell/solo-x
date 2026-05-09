# SOLO.X 项目总控文件

> 最后更新：2026-05-09
> 当前阶段：MVP 开发
> 当前 Sprint：Sprint 1

---

## 文档体系索引

| 编号 | 文档 | 状态 | 说明 |
|------|------|------|------|
| 01 | [BRD 商业需求文档](01-BRD.md) | ✅ 完成 | 商业目标、用户画像、KPI、风险评估 |
| 02 | [MRD 市场需求文档](02-MRD.md) | ✅ 完成 | 市场分析、竞品分析、差异化定位 |
| 03 | [PRD 产品需求文档](PRD.md) | ✅ 完成 v1.1 | 功能模块、页面规格、MVP 范围 |
| 04 | [原型规格说明](04-prototype.md) | ✅ 完成 | 页面清单、线框图、导航关系、交互说明 |
| 05 | [高保真设计规范](05-design.md) | ✅ 完成 | 配色/字体/间距/组件库（基于 demo-6-zen.html）|
| 06 | [技术设计文档](06-tech-design.md) | ✅ 完成 | 架构、数据模型、API、SEO、安全 |
| 07 | [实施计划](07-implementation.md) | ✅ 完成 | 6 个 Sprint、任务拆分、验收标准 |
| 08 | [测试计划](08-test-plan.md) | ✅ 完成 | 测试策略、用例清单、兼容性矩阵 |
| 09 | [发布与灰度计划](09-release-plan.md) | ✅ 完成 | 环境策略、分支策略、灰度四阶段 |

## Sprint 进度

| Sprint | 内容 | 状态 | 开始 | 结束 |
|--------|------|------|------|------|
| S1 | 基础框架 + 共享组件 | ✅ 完成 | 05-09 | 05-09 |
| S2 | 文章系统 + MDX + SEO | ✅ 完成 | 05-09 | 05-09 |
| S3 | 内容填充 + 关于 + 占位页 | ✅ 完成 | 05-09 | 05-09 |
| S4 | 订阅系统 + 法律页面 | ✅ 完成 | 05-09 | 05-09 |
| S5 | 内测防护 + 部署 | ✅ 完成 | 05-09 | 05-09 |
| S6 | 功能开关 + 灰度准备 | ✅ 完成 | 05-09 | 05-09 |

## S1 当前任务

| # | 任务 | 文件 | 状态 |
|---|------|------|------|
| 1.1 | 首页已完成 | `app/page.tsx` | ✅ |
| 1.2 | 提取 Nav 组件 | `components/nav.tsx` | ✅ |
| 1.3 | 提取 Footer 组件 | `components/footer.tsx` | ✅ |
| 1.4 | 提取 InkDivider 组件 | `components/ink-divider.tsx` | ✅ |
| 1.5 | 提取 SubscribeForm 组件 | `components/subscribe-form.tsx` | ✅ |
| 1.6 | 创建 Placeholder 组件 | `components/placeholder.tsx` | ✅ |
| 1.7 | 重构首页使用共享组件 | `app/page.tsx` | ✅ |
| 1.8 | 根布局优化（meta/字体） | `app/layout.tsx` | ✅ |
| 1.9 | 创建 ZenCard 组件 | `components/zen-card.tsx` | ✅ |
| 1.10 | 创建类型/常量/功能开关 | `types/`, `lib/` | ✅ |
| 1.11 | 创建环境变量和 gitignore | `.env.*`, `.gitignore` | ✅ |
| 1.12 | 构建验证 | `npm run build` | ✅ |

## PM 工具链

| 角色 | 工具 | 用途 |
|------|------|------|
| 主 PM | Forge | 需求追踪、进度管理、崩溃恢复 |
| 执行层 | Superpowers (subagent-driven) | 任务调度、两阶段审查 |
| 持久化 | planning-with-files | 磁盘状态、会话恢复 |
| 记忆 | auto-memory | 跨会话知识持久化 |

## 技术栈

- Next.js 16 + TypeScript + App Router
- 纯自定义 CSS (CSS Variables)
- MDX (gray-matter + next-mdx-remote)
- Resend (邮件订阅)
- Vercel (部署)

## 关键决策记录

| 日期 | 决策 | 原因 |
|------|------|------|
| 05-09 | 禅意竹影风格 | 用户确认，替代 Maggie Appleton 方向 |
| 05-09 | 纯自定义 CSS | 弃用 shadcn-ui/taxonomy，设计完全自定义 |
| 05-09 | Forge + Superpowers 组合 | Forge 做状态管理，Superpowers 做执行调度 |
