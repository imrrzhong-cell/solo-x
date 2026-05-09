# SOLO.X — 产品需求文档 (PRD)

> 版本：v1.1 | 更新：2026-05-09
> 变更：整合原始需求 + 10 项缺失补充 + 技术修正 + 禅意设计参考
> 定位：一人公司创作平台 · 个人品牌网站
> 阶段：MVP 内测期

---

## 1. 产品概述

SOLO.X 是一个面向独立创作者的个人品牌网站，聚合六种内容形式（文章、音乐、视频课程、小程序、Web应用、创意游戏）和 OPC 工具箱，通过会员体系实现商业化。

**MVP 目标**：搭建可运行的中文个人网站，文章系统完整可用，其余模块保留接口但不露出。

---

## 2. 功能模块

### 2.1 模块总览

| # | 模块 | 路由 | MVP 状态 | 说明 |
|---|------|------|----------|------|
| 壹 | 深度文章 | `/articles` `/articles/[slug]` | **启用** | MDX 驱动，SEO 完备 |
| 贰 | 原创音乐 | `/music` | 占位 | 音乐作品展示与播放 |
| 叁 | 视频课程 | `/courses` | 占位 | OPC 方法论系统教程 |
| 肆 | 微信小程序 | `/apps` | 占位 | 效率工具与数据看板 |
| 伍 | 网页应用 | `/webapps` | 占位 | AI 写作、品牌命名等 Web 工具 |
| 陆 | 创意游戏 | `/games` | 占位 | 轻量网页游戏 |
| — | OPC 工具箱 | `/tools` | 占位 | 18 款效率工具 |
| — | 会员计划 | `/pricing` | 占位（接口预留） | 三档定价：探索者/创作者/年度 |
| — | 关于页 | `/about` | **启用** | 个人简介 + 社交链接 |
| — | 联系页 | `/contact` | 占位 | 联系表单 |
| — | 隐私政策 | `/privacy` | **启用** | PIPL 合规 |
| — | 使用条款 | `/terms` | **启用** | 法律合规 |

### 2.2 首页结构

```
┌─────────────────────────────────────────┐
│ Nav: SOLO.X · 创作 · 工具 · 课程 · 关于 │
├─────────────────────────────────────────┤
│ Hero (双栏)                              │
│   左：标语 + 诗句 + CTA                   │
│   右：3 张数据卡片（240+内容/18工具/5K+会员）│
├─────────────────────────────────────────┤
│ 竹 ──── 墨线分隔 ──── 竹                  │
├─────────────────────────────────────────┤
│ 六种内容形式 (3×2 网格)                    │
│   壹·深度文章 | 贰·原创音乐 | 叁·视频课程  │
│   肆·小程序   | 伍·网页应用 | 陆·创意游戏  │
├─────────────────────────────────────────┤
│ 竹 ──── 墨线分隔 ──── 竹                  │
├─────────────────────────────────────────┤
│ OPC 工具箱 (4×2 网格)                     │
│   8 张工具卡片（免费/Pro 标签）            │
├─────────────────────────────────────────┤
│ 竹 ──── 墨线分隔 ──── 竹                  │
├─────────────────────────────────────────┤
│ 会员计划 (3 列定价)                        │
│   探索者 ¥0 | 创作者 ¥68/月 | 年度 ¥580/年 │
├─────────────────────────────────────────┤
│ Footer: SOLO.X · © 2025                  │
└─────────────────────────────────────────┘
```

### 2.3 文章系统（MVP 核心模块）

**文章列表页** `/articles`
- 反向时间流卡片列表
- 内容类型筛选栏：全部 / Essay / Note / Tool / Smidgeon / Now Update
- 每张卡片：类型标签 + 标题 + 摘要 + 标签 + 相对时间 + 阅读时长

**文章详情页** `/articles/[slug]`
- 衬线大标题 + 元数据（日期/阅读时长/标签）
- MDX 正文渲染，支持代码高亮
- 底部：返回列表 + 邮箱订阅入口
- SEO：meta title/description + JSON-LD + OG image + Twitter Card

**内容类型**（用于文章分类，区别于功能模块）：
| 类型 | 含义 | 卡片样式 |
|------|------|----------|
| Essay | 成熟长文 | 完整描述 + 标签 |
| Note | 成长中的想法 | 简短描述 |
| Tool | 工具推荐 | 功能描述 |
| Smidgeon | 碎片灵感 | 内容摘要 |
| Now Update | 月度动态 | 截断描述 |

**文章 Front Matter 规范**：
```yaml
---
title: "文章标题"
date: "2026-05-09"
type: "essay"          # essay | note | tool | smidgeon | now
tags: ["标签1", "标签2"]
excerpt: "文章摘要，150字以内"
draft: false
---
```

### 2.4 关于页 `/about`

- 个人头像占位
- 个人简介（背景、技能、理念）
- 技能标签云
- 社交链接（GitHub / Twitter / 邮箱 / 微信）

### 2.5 占位页面（统一模板）

所有占位页面共用一套设计：
- 模块名称 + 汉字序号（壹贰叁肆伍陆）
- "内容准备中，即将上线" 描述
- 邮箱订阅表单："订阅更新，第一时间获取上线通知"
- 返回首页链接

### 2.6 订阅系统

- 邮件服务：Resend
- 架构：表单 → Server Action → Resend API
- 位置：首页定价区下方 + 文章详情页底部 + 各占位页面
- PIPL 合规：同意声明 + 隐私政策链接 + 退订支持
- API 密钥服务端存储，不暴露客户端

### 2.7 会员/定价系统

**MVP 策略**：首页展示定价 UI，但"开启会员"按钮不实际跳转，仅保留数据模型接口。

**三档定价**：
| 档位 | 价格 | 权益 |
|------|------|------|
| 探索者 | ¥0 永久 | 免费内容阅读 + 6 款基础工具 + 每月 3 篇付费文章 |
| 创作者 | ¥68/月 | 全部内容 + 18 款 Pro 工具 + 课程 + 社群 |
| 年度 | ¥580/年 | 创作者权益 + 研究报告 + 1v1 问答 + 优先体验 |

**接口预留**：
- 数据模型：`User`, `Subscription`, `Plan`
- API 路由骨架：`/api/subscription`, `/api/webhook`
- 不露出：登录按钮、支付流程、会员专属内容标记

---

## 3. 设计规范

> 视觉参考：`demo-6-zen.html`（禅意竹影风格）

### 3.1 配色

```css
--white: #fafaf7;      /* 页面背景 */
--off: #f2f0ea;        /* 卡片/二级背景 */
--warm: #e8e4d9;       /* hover 背景 */
--warm2: #d8d2c2;      /* 序号颜色 */
--sage: #7d9b76;       /* 鼠尾草绿-浅 */
--sage2: #5a7a54;      /* 鼠尾草绿-中 (CTA) */
--sage3: #3d5939;      /* 鼠尾草绿-深 (hover) */
--char: #1e1e1e;       /* 正文黑 */
--char2: #3a3a3a;      /* 二级文字 */
--char3: #666;         /* 辅助文字 */
--border: rgba(30,30,30,.1);    /* 边框 */
--border2: rgba(30,30,30,.18);  /* 强调边框 */
--accent: #c4842a;     /* 金色强调 (付费标签) */
--accent-light: #f0d4a0;
```

### 3.2 字体

| 用途 | 字体 | 回退 |
|------|------|------|
| 标题 H1/H2 | Noto Serif SC (500) | Georgia, serif |
| 正文 | Noto Sans SC (300) | 系统中文字体栈 |
| 数字/序号 | Shippori Mincho (500) | serif |
| 代码 | IBM Plex Mono | SF Mono, Consolas |

### 3.3 核心视觉元素

- 竹纹网格背景（opacity: .025）
- 墨线分隔符（竹字 + 两侧横线）
- 汉字水印（Hero 区 "独" 字，大号低透明度）
- 中文序号（壹贰叁肆伍陆）
- fadeIn 动画（delay 阶梯：0.2s / 0.4s / 0.6s）
- 胶囊按钮（border-radius: 100px）
- 毛玻璃导航栏（backdrop-filter: blur(10px)）

### 3.4 响应式断点

| 断点 | 布局变化 |
|------|----------|
| > 900px | 桌面：双栏 Hero，3列网格，4列工具 |
| 550-900px | 平板：单栏 Hero，2列网格，2列工具 |
| < 550px | 手机：汉堡菜单，单列所有网格 |

---

## 4. 技术架构

```
框架:        Next.js 16 (App Router) + TypeScript
样式:        纯自定义 CSS (CSS Variables)
内容:        MDX (gray-matter + next-mdx-remote)
邮件:        Resend + Server Actions
部署:        Vercel (默认域名)
分析:        Plausible Cloud (MVP 后集成)
评论:        Waline (MVP 后集成)
搜索:        Pagefind (MVP 后集成)
监控:        Sentry (MVP 后集成)
```

### 4.1 目录结构

```
app/
  layout.tsx          — 根布局（字体、全局 CSS）
  page.tsx            — 首页
  globals.css         — 设计系统
  articles/
    page.tsx          — 文章列表
    [slug]/
      page.tsx        — 文章详情
  about/
    page.tsx          — 关于页
  tools/page.tsx      — 占位
  apps/page.tsx       — 占位
  courses/page.tsx    — 占位
  webapps/page.tsx    — 占位
  games/page.tsx      — 占位
  pricing/page.tsx    — 占位
  contact/page.tsx    — 占位
  privacy/page.tsx    — 隐私政策
  terms/page.tsx      — 使用条款
  not-found.tsx       — 自定义 404
content/
  articles/           — MDX 文章源文件
components/
  nav.tsx             — 导航栏
  zen-card.tsx        — 数据卡片
  ink-divider.tsx     — 墨线分隔
  article-card.tsx    — 文章卡片
  subscribe-form.tsx  — 订阅表单
  placeholder.tsx     — 占位页面模板
lib/
  articles.ts         — 文章读取/解析
  subscribe.ts        — 订阅 Server Action
public/
  images/             — 图片资源
```

### 4.2 功能开关

```env
NEXT_PUBLIC_FEATURE_ARTICLES=true
NEXT_PUBLIC_FEATURE_MUSIC=false
NEXT_PUBLIC_FEATURE_COURSES=false
NEXT_PUBLIC_FEATURE_APPS=false
NEXT_PUBLIC_FEATURE_WEBAPPS=false
NEXT_PUBLIC_FEATURE_GAMES=false
NEXT_PUBLIC_FEATURE_TOOLS=false
NEXT_PUBLIC_FEATURE_PRICING=false
NEXT_PUBLIC_FEATURE_MEMBERS=false
```

---

## 5. MVP 实施范围

### 5.1 本次交付（MVP）

1. 首页（完整 zen 设计，所有模块展示）
2. 文章系统（列表页 + 详情页 + 3 篇初始文章）
3. 关于页
4. 占位页面（6 个功能模块 + 联系页，统一模板）
5. 订阅表单（Resend 集成）
6. 法律页面（隐私政策 + 使用条款）
7. 自定义 404
8. 内测防护（noindex + robots.txt）

### 5.2 MVP 后迭代

1. 站内搜索（Pagefind）
2. 评论系统（Waline）
3. 分析工具（Plausible）
4. 错误监控（Sentry）
5. 音乐/课程/应用/游戏模块逐一上线
6. 会员系统（登录 + 支付 + 内容权限）
7. OPC 工具箱上线

---

## 6. 已识别的需求补充与技术修正

> 来源：对原始需求文档的审查（10 项缺失 + 6 项技术修正）

### 6.1 原始需求 10 项缺失（已纳入本 PRD）

| # | 缺失项 | PRD 对应位置 | MVP 处理 |
|---|--------|-------------|----------|
| 1 | 响应式/移动端适配 | §3.4 断点 | 已纳入 CSS |
| 2 | 邮箱订阅技术方案 | §2.6 订阅系统 | MVP 实现 |
| 3 | OG 与社交分享 | §2.3 文章详情页 | MVP 实现 |
| 4 | 法律合规页面 | §2.1 隐私/条款 | MVP 实现 |
| 5 | 网站分析 | §4 技术架构 | MVP 后 |
| 6 | 站内搜索 | §4 技术架构 | MVP 后 |
| 7 | 评论/互动 | §4 技术架构 | MVP 后 |
| 8 | 性能优化策略 | §4 技术架构 | MVP 后 |
| 9 | 错误处理与监控 | §4 技术架构 | MVP 后 |
| 10 | 无障碍访问 | §3 设计规范 | MVP 后 |

### 6.2 技术修正记录

| 原始方案 | 修正为 | 原因 |
|----------|--------|------|
| `maximum-scale=1.0` | 仅 `width=device-width, initial-scale=1` | 违反 WCAG 缩放要求 |
| Brevo 邮件 | **Resend** | API 更简洁，Next.js 集成更好，免费 100 封/天 |
| Giscus 评论 | **Waline** | 中文用户不一定有 GitHub 账号，Giscus 国内加载不稳定 |
| react-share 微信分享 | **Twitter/微博 + 复制链接 + 文章二维码** | react-share 不支持微信直接分享 |
| Umami 分析 | **Plausible Cloud**（$9/月） | Umami 需要额外数据库实例，Plausible 零配置 |
| GDPR 合规 | **PIPL**（个人信息保护法） | 面向中国用户，优先遵守国内法规 |
| Termly 生成法律页面 | **自行编写** | Termly 偏欧美合规，不适配 PIPL |
| shadcn-ui/taxonomy 模板 | **纯自定义 CSS** | 模板可能过时，新设计完全自定义，模板组件不再适用 |

### 6.3 架构层级说明

本站有两层分类体系，不可混淆：

**第一层：功能模块**（顶层路由，对应导航菜单和首页六大区块）
- 壹·深度文章 / 贰·原创音乐 / 叁·视频课程 / 肆·小程序 / 伍·网页应用 / 陆·创意游戏
- 每个模块是独立路由，有自己的列表页和详情页

**第二层：文章子类型**（仅用于文章模块内部的分类筛选）
- Essay / Note / Tool / Smidgeon / Now Update
- 影响卡片展示样式和筛选逻辑，不影响顶层路由
