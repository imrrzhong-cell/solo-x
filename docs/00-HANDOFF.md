# SOLO.X 项目交接文档

> 写于：2026-05-09 20:30
> 用途：新会话接手后，按此文档继续执行所有剩余任务
> 权限模式：dangerous（无需人工确认，直接执行）

---

## 1. 你是谁

你是 SOLO.X 个人品牌网站的执行工程师。你的任务是从当前进度继续，完成 Sprint 1 剩余任务，然后依次完成 Sprint 2-6 的所有任务。用户授权你自主执行，不需要逐个确认。

## 2. 项目概况

- **产品**：SOLO.X — 一人公司创作平台
- **技术栈**：Next.js 16 + TypeScript + App Router + 纯自定义 CSS + MDX
- **设计风格**：禅意竹影（视觉参考：`demo-6-zen.html`）
- **部署**：Vercel（内测期用默认域名）
- **Dev Server**：`npm run dev`（已在 localhost:3001 运行）

## 3. 文档体系

所有文档在 `docs/` 目录，按编号排序：

| 文件 | 内容 | 你需要关注的 |
|------|------|-------------|
| `00-PROJECT.md` | 项目总控 + Sprint 进度 | **每次开始前先读这个** |
| `01-BRD.md` | 商业需求 | 了解背景即可 |
| `02-MRD.md` | 市场分析 | 了解背景即可 |
| `PRD.md` | 产品需求 | **核心参考**，功能模块定义在这里 |
| `04-prototype.md` | 原型规格 | **页面线框图和交互说明** |
| `05-design.md` | 高保真设计规范 | **CSS 数值精确参考** |
| `06-tech-design.md` | 技术设计 | **代码架构、数据模型、API 设计** |
| `07-implementation.md` | 实施计划 | **你的任务清单，按 Sprint 组织** |
| `08-test-plan.md` | 测试计划 | 每个 Sprint 完成后跑测试 |
| `09-release-plan.md` | 发布与灰度 | Sprint 5-6 时参考 |

## 4. 当前进度

### 已完成

- ✅ 项目搭建（Next.js 16 + App Router）
- ✅ 首页完整实现（`app/page.tsx`）
- ✅ CSS 设计系统（`app/globals.css`）
- ✅ 根布局（`app/layout.tsx`，基础版）
- ✅ 完整文档体系（9 份标准文档）

### 当前文件结构

```
app/
  globals.css         ✅ 禅意设计系统（完整）
  layout.tsx          ✅ 根布局（需优化：字体加载、meta、nav/footer 集成）
  page.tsx            ✅ 首页（需重构：提取共享组件后重新组装）
docs/                 ✅ 9 份标准文档
demo-6-zen.html       ✅ 视觉参考（用户确认的设计风格）
```

### 未创建的文件（需要你创建）

```
types/article.ts          — 文章类型定义
lib/constants.ts          — 站点常量
lib/features.ts           — 功能开关
lib/articles.ts           — MDX 文章读取/解析
lib/mdx.ts                — MDX 组件映射
lib/subscribe.ts          — 订阅 Server Action
components/nav.tsx        — 导航栏
components/footer.tsx     — 页脚
components/ink-divider.tsx— 墨线分隔符
components/subscribe-form.tsx — 订阅表单
components/placeholder.tsx    — 占位页面模板
components/zen-card.tsx   — 数据卡片
components/article-card.tsx   — 文章卡片
content/articles/         — MDX 文章目录
app/articles/page.tsx     — 文章列表
app/articles/[slug]/page.tsx — 文章详情
app/about/page.tsx        — 关于页
app/music/page.tsx        — 占位：音乐
app/courses/page.tsx      — 占位：课程
app/apps/page.tsx         — 占位：小程序
app/webapps/page.tsx      — 占位：网页应用
app/games/page.tsx        — 占位：游戏
app/tools/page.tsx        — 占位：OPC 工具箱
app/contact/page.tsx      — 占位：联系
app/pricing/page.tsx      — 占位：定价（可选，首页已有）
app/privacy/page.tsx      — 隐私政策
app/terms/page.tsx        — 使用条款
app/not-found.tsx         — 404
app/error.tsx             — 错误边界
app/sitemap.ts            — sitemap
app/robots.ts             — robots.txt
.env.example              — 环境变量模板
.env.local                — 本地环境变量（不提交 git）
.gitignore                — git 忽略
admin-help.md             — 管理文档
```

## 5. 执行顺序

严格按照以下顺序执行，每个 Sprint 完成后更新 `docs/00-PROJECT.md` 的状态表。

### Sprint 1（剩余 13 个任务）

1. **1.1** 安装依赖：`npm install next-mdx-remote gray-matter resend`
2. **1.2** 创建 `types/article.ts`（类型定义，参考 `06-tech-design.md` §3）
3. **1.3** 创建 `lib/constants.ts`（站点常量，参考 `07-implementation.md` §1.3）
4. **1.4** 创建 `lib/features.ts`（功能开关，参考 `07-implementation.md` §1.4）
5. **1.6** 创建 `components/nav.tsx`（从 page.tsx 中提取导航栏，加入功能开关逻辑）
6. **1.7** 创建 `components/footer.tsx`（从 page.tsx 中提取 footer）
7. **1.8** 创建 `components/ink-divider.tsx`（从 page.tsx 中提取墨线分隔符）
8. **1.9** 创建 `components/subscribe-form.tsx`（静态版，`'use client'`，不含提交逻辑）
9. **1.10** 创建 `components/placeholder.tsx`（占位页面通用模板，接收 title/number/description）
10. **1.11** 创建 `components/zen-card.tsx`（数据卡片组件，从 page.tsx 提取）
11. **1.12** 优化 `app/layout.tsx`（集成 nav + footer，优化字体加载，添加 noindex meta）
12. **1.13** 重构 `app/page.tsx`（用共享组件替换内联 HTML）
13. **1.14** 创建 `.env.example` + `.env.local`
14. **1.15** 创建 `.gitignore`
15. **验证**：`npm run dev` + `npm run build` 通过

### Sprint 2（10 个任务）

1. **2.1** 创建 `lib/articles.ts`（MDX 读取/解析/排序/筛选）
2. **2.2** 创建 `lib/mdx.ts`（MDX 组件映射）
3. **2.3** 创建 `components/article-card.tsx`
4. **2.4** 创建 `app/articles/page.tsx`（列表页 + 类型筛选）
5. **2.5** 创建 `app/articles/[slug]/page.tsx`（详情页 + MDX 渲染）
6. **2.6** 创建 `content/articles/hello-world.mdx`（1 篇测试文章）
7. **2.7** 详情页 SEO metadata（generateMetadata）
8. **2.8** 详情页 JSON-LD
9. **2.9** 创建 `app/sitemap.ts`
10. **2.10** 创建 `app/robots.ts`

### Sprint 3（13 个任务）

1. **3.1-3.3** 3 篇 MDX 文章（每篇 ≥ 500 字）
2. **3.4** 关于页
3. **3.5-3.11** 7 个占位页面（复用 placeholder 组件）
4. **3.12** 404 页面
5. **3.13** error.tsx 错误边界

### Sprint 4（6 个任务）

1. **4.1** `lib/subscribe.ts`（Server Action + Resend）
2. **4.2** 升级 subscribe-form.tsx（接入 Server Action）
3. **4.3-4.4** 首页 + 文章详情页集成订阅
4. **4.5** 隐私政策页（PIPL 合规）
5. **4.6** 使用条款页

### Sprint 5（7 个任务）

1. **5.1** 确认 noindex + robots.txt
2. **5.2** 环境变量文件
3. **5.3** 全站构建验证（`npm run build` + `npx tsc --noEmit`）
4. **5.4** Git 初始化 + 首次提交 + GitHub 推送
5. **5.5** Vercel 部署（或先跳过，等用户配置）
6. **5.6** 部署后验证
7. **5.7** `admin-help.md`

### Sprint 6（8 个任务）

1. **6.1-6.3** 功能开关联动（首页 + 导航栏动态显隐）
2. **6.4** Preview 部署验证
3. **6.5** 补充管理文档
4. **6.6** 备用 API 路由骨架
5. **6.7** OG 图片预留
6. **6.8** 全站最终审查

## 6. 关键约束

### 设计约束（不可违反）

- **严格遵循 `demo-6-zen.html` 的视觉风格**：配色、字体、间距、动画
- 所有 CSS 数值参考 `docs/05-design.md`
- 不要自行发挥设计创意，用户已明确认为 AI 设计能力差
- 组件样式通过 CSS 类名控制，不要用 inline style

### 技术约束

- 不要安装 Tailwind CSS，项目用的是纯自定义 CSS
- 不要引入 shadcn/ui 或任何 UI 框架
- 字体：Noto Serif SC（标题）、Noto Sans SC（正文）、Shippori Mincho（序号）
- 响应式断点：900px（平板）、550px（手机）

### 功能约束

- MVP 只做文章系统，其余模块保留接口但不露出
- 登录/支付/会员专属内容：不实现、不露出
- 订阅表单：Sprint 1 只做 UI，Sprint 4 接入 Resend
- 内测期所有页面 noindex + robots.txt 禁止爬虫

### 数据约束

- 文章内容用 MDX 格式，存在 `content/articles/` 目录
- 文章子类型：essay / note / tool / smidgeon / now
- 功能模块：文章 / 音乐 / 课程 / 小程序 / 网页应用 / 游戏（顶层路由）

## 7. 注意事项

1. **每完成一个 Sprint**，更新 `docs/00-PROJECT.md` 中的进度表
2. **每完成一个 Sprint**，运行 `npm run build` 确认构建通过
3. **globals.css 已经写好了**，不要重写，可以扩展但不要删除现有内容
4. **page.tsx 已经写好了**，重构时保留所有内容，只是拆成组件
5. Sprint 3 和 Sprint 4 可以并行，但单人执行建议串行
6. Sprint 5 的 Vercel 部署可能需要用户手动操作（配置环境变量）
7. **不要修改 `demo-6-zen.html`**，这是用户的视觉参考

## 8. 快速启动命令

```bash
# 确认在项目目录
cd /Users/rustyryan/Documents/01-Projects/09-rrzhong个人网站

# 检查 dev server 是否在运行
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001

# 如果没在运行，启动
npm run dev

# 开始执行 Sprint 1 剩余任务
# 从 1.1 开始：安装依赖
```
