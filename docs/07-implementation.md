# SOLO.X -- 实施计划

> 版本：v1.0 | 日期：2026-05-09
> 组织方式：6 个 Sprint，每个 Sprint 有明确交付物和验收标准
> 前置条件：PRD（docs/PRD.md）+ 技术设计文档（docs/06-tech-design.md）

---

## Sprint 1：基础框架

**目标**：搭建项目骨架，完成共享组件和布局模板，首页可以渲染基础结构

**预估工期**：2-3 天

### 任务清单

| # | 任务 | 文件路径 | 复杂度 |
|---|------|----------|--------|
| 1.1 | 安装新增依赖 | `package.json` | 低 |
| 1.2 | 创建类型定义 | `types/article.ts` | 低 |
| 1.3 | 创建站点常量 | `lib/constants.ts` | 低 |
| 1.4 | 创建功能开关模块 | `lib/features.ts` | 低 |
| 1.5 | 创建全局 CSS 设计系统 | `app/globals.css` | 高 |
| 1.6 | 创建导航栏组件 | `components/nav.tsx` | 中 |
| 1.7 | 创建页脚组件 | `components/footer.tsx` | 低 |
| 1.8 | 创建墨线分隔符组件 | `components/ink-divider.tsx` | 低 |
| 1.9 | 创建订阅表单组件（静态版） | `components/subscribe-form.tsx` | 中 |
| 1.10 | 创建占位页面模板组件 | `components/placeholder.tsx` | 低 |
| 1.11 | 创建数据卡片组件 | `components/zen-card.tsx` | 中 |
| 1.12 | 创建根布局 | `app/layout.tsx` | 中 |
| 1.13 | 创建首页骨架 | `app/page.tsx` | 高 |
| 1.14 | 配置环境变量模板 | `.env.example`, `.env.local` | 低 |
| 1.15 | 更新 .gitignore | `.gitignore` | 低 |

### 详细说明

#### 1.1 安装新增依赖

```bash
npm install next-mdx-remote gray-matter resend
```

#### 1.2 types/article.ts

定义 `ArticleType`、`ArticleFrontmatter`、`Article`、`SubscribePayload`、`SubscribeResult` 等类型。详见技术设计文档 §3。

#### 1.3 lib/constants.ts

```typescript
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'SOLO.X';
export const SITE_DESCRIPTION = '独立创作者的内容平台，汇聚文章、工具、课程与灵感';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://solo-x.vercel.app';

export const NAV_LINKS = [
  { href: '/articles', label: '创作', feature: 'ARTICLES' },
  { href: '/tools', label: '工具', feature: 'TOOLS' },
  { href: '/courses', label: '课程', feature: 'COURSES' },
  { href: '/about', label: '关于', feature: null },  // 始终显示
];

export const SOCIAL_LINKS = {
  github: 'https://github.com/your-username',
  twitter: 'https://twitter.com/your-username',
  email: 'your@email.com',
  wechat: 'your-wechat-id',
};
```

#### 1.5 app/globals.css

需要包含完整的设计系统：

- CSS Variables（全部配色、字体、间距）
- Reset 样式
- 全局排版样式（body, h1-h6, p, a, ul, ol, blockquote, code, pre）
- 组件样式类（`.nav`, `.footer`, `.ink-divider`, `.zen-card`, `.article-card`, `.subscribe-form`, `.placeholder`）
- 文章排版样式（`.article-detail`, `.article-h1`, `.article-p` 等）
- 错误页面样式（`.error-page`）
- 动画（`@keyframes fadeIn`）
- 响应式断点媒体查询（`@media (max-width: 900px)`, `@media (max-width: 550px)`）

#### 1.6 components/nav.tsx

- 毛玻璃效果导航栏（`backdrop-filter: blur(10px)`）
- 左侧：SOLO.X Logo
- 右侧：导航链接（根据功能开关动态显隐）
- 移动端：汉堡菜单（`< 550px`）
- 样式通过 CSS 类名控制

#### 1.9 components/subscribe-form.tsx

此 Sprint 仅创建静态 UI 版本（不含 Server Action 调用）：

- 邮箱输入框
- 同意声明复选框 + 隐私政策链接
- 提交按钮
- 结果消息区域
- 标记 `'use client'`

#### 1.12 app/layout.tsx

- 字体加载（Noto Serif SC, Noto Sans SC, IBM Plex Mono）
- HTML lang="zh-CN"
- 内测期 meta robots noindex
- `<body>` 包含 nav + children + footer

#### 1.13 app/page.tsx

首页完整结构（参照 PRD §2.2）：

1. Hero 区（双栏：标语 + 数据卡片）
2. 墨线分隔
3. 六种内容形式（3x2 网格）
4. 墨线分隔
5. OPC 工具箱（4x2 网格，占位卡片）
6. 墨线分隔
7. 会员计划（3 列定价）
8. 订阅表单

### 验收标准

- [ ] `npm run dev` 启动无报错
- [ ] 首页在浏览器中完整渲染，所有区域可见
- [ ] 导航栏正确显示已启用/隐藏已禁用的菜单项
- [ ] 响应式：桌面/平板/手机三档布局正常
- [ ] CSS 变量系统工作正常，可一键切换配色
- [ ] 墨线分隔符组件正确渲染
- [ ] 订阅表单 UI 完整（不含提交逻辑）
- [ ] `npm run build` 构建通过

---

## Sprint 2：文章系统

**目标**：MDX 内容管道完整可用，文章列表页和详情页功能正常

**预估工期**：2-3 天

### 任务清单

| # | 任务 | 文件路径 | 复杂度 |
|---|------|----------|--------|
| 2.1 | 创建文章读取/解析模块 | `lib/articles.ts` | 高 |
| 2.2 | 创建 MDX 组件映射 | `lib/mdx.ts` | 中 |
| 2.3 | 创建文章卡片组件 | `components/article-card.tsx` | 中 |
| 2.4 | 创建文章列表页 | `app/articles/page.tsx` | 高 |
| 2.5 | 创建文章详情页 | `app/articles/[slug]/page.tsx` | 高 |
| 2.6 | 创建占位 MDX 文章（1篇） | `content/articles/hello-world.mdx` | 低 |
| 2.7 | 实现 SEO metadata 生成 | `app/articles/[slug]/page.tsx` 内 | 中 |
| 2.8 | 实现 JSON-LD 注入 | `app/articles/[slug]/page.tsx` 内 | 中 |
| 2.9 | 配置 sitemap | `app/sitemap.ts` | 低 |
| 2.10 | 配置 robots.txt | `app/robots.ts` | 低 |

### 详细说明

#### 2.1 lib/articles.ts

实现以下函数：

- `getAllArticles(): Article[]` — 读取全部 MDX，解析 frontmatter，排序
- `getArticleBySlug(slug): Article | undefined` — 按 slug 查找
- `getArticlesByType(type): Article[]` — 按类型筛选
- `getAllTags(): string[]` — 获取所有标签
- `getAllSlugs(): string[]` — 获取所有 slug（用于 `generateStaticParams`）
- `calculateReadingTime(content): number` — 计算阅读时长

#### 2.4 app/articles/page.tsx

- 顶部：页面标题 + 内容类型筛选栏（全部 / Essay / Note / Tool / Smidgeon / Now Update）
- 主体：反向时间流卡片列表
- 每张卡片显示：类型标签 + 标题 + 摘要 + 标签 + 相对时间 + 阅读时长
- 筛选逻辑：URL searchParams 驱动，如 `/articles?type=essay`
- 使用 Server Component，筛选通过页面刷新实现（无客户端 JS）

#### 2.5 app/articles/[slug]/page.tsx

- `generateStaticParams`：预渲染所有文章
- `generateMetadata`：动态生成 SEO metadata
- 页面结构：
  - 标题（衬线字体，大号）
  - 元数据行：日期 / 阅读时长 / 标签
  - MDX 正文渲染（`compileMDX` from `next-mdx-remote/rsc`）
  - JSON-LD script 注入
  - 底部：返回文章列表 + 订阅表单

#### 2.6 content/articles/hello-world.mdx

```markdown
---
title: "你好，SOLO.X"
date: "2026-05-09"
type: "essay"
tags: ["开篇", "独立创作"]
excerpt: "SOLO.X 的第一篇文章，记录这个一人公司创作平台的诞生。"
draft: false
---

这里是正文内容...
```

### 验收标准

- [ ] 文章列表页正确显示所有文章卡片
- [ ] 类型筛选功能正常（点击类型标签可筛选）
- [ ] 文章详情页正确渲染 MDX 内容
- [ ] 代码块在文章中有正确的样式
- [ ] 阅读时长估算合理（中文约 400 字/分钟）
- [ ] 文章详情页 SEO metadata 正确（查看页面源代码验证）
- [ ] JSON-LD 结构化数据可被 Google 富媒体测试工具识别
- [ ] sitemap.xml 正确列出所有页面
- [ ] robots.txt 禁止所有爬虫（内测模式）
- [ ] 访问不存在的 slug 显示自定义 404 页面
- [ ] `npm run build` 构建通过

---

## Sprint 3：内容填充

**目标**：完成所有初始内容页面

**预估工期**：1-2 天

### 任务清单

| # | 任务 | 文件路径 | 复杂度 |
|---|------|----------|--------|
| 3.1 | 撰写 MDX 文章：关于这个网站 | `content/articles/about-this-site.mdx` | 中 |
| 3.2 | 撰写 MDX 文章：个人介绍 | `content/articles/who-am-i.mdx` | 中 |
| 3.3 | 撰写 MDX 文章：AI 工具推荐 | `content/articles/ai-tools-for-creators.mdx` | 中 |
| 3.4 | 创建关于页 | `app/about/page.tsx` | 中 |
| 3.5 | 创建占位页面：原创音乐 | `app/music/page.tsx` | 低 |
| 3.6 | 创建占位页面：视频课程 | `app/courses/page.tsx` | 低 |
| 3.7 | 创建占位页面：小程序 | `app/apps/page.tsx` | 低 |
| 3.8 | 创建占位页面：网页应用 | `app/webapps/page.tsx` | 低 |
| 3.9 | 创建占位页面：创意游戏 | `app/games/page.tsx` | 低 |
| 3.10 | 创建占位页面：OPC 工具箱 | `app/tools/page.tsx` | 低 |
| 3.11 | 创建占位页面：联系页 | `app/contact/page.tsx` | 低 |
| 3.12 | 创建自定义 404 页面 | `app/not-found.tsx` | 低 |
| 3.13 | 创建错误边界页面 | `app/error.tsx` | 低 |

### 详细说明

#### 3.1-3.3 MDX 文章规范

每篇文章必须满足：

- frontmatter 完整（title, date, type, tags, excerpt, draft）
- 字数 ≥ 500 字（正文部分）
- 有清晰的 H2/H3 标题层级
- 有代码块或列表等丰富格式
- 摘要 ≤ 150 字

**文章 1**：`about-this-site.mdx`
- type: `essay`
- tags: `["开篇", "独立创作"]`
- 内容：建站动机、内容方向、内测说明

**文章 2**：`who-am-i.mdx`
- type: `essay`
- tags: `["自我介绍", "创作理念"]`
- 内容：背景、技能、当前工作、创作理念

**文章 3**：`ai-tools-for-creators.mdx`
- type: `tool`
- tags: `["AI", "工具推荐", "效率"]`
- 内容：5-8 个 AI 工具推荐，每个有名称、简述、使用场景

#### 3.4 app/about/page.tsx

关于页结构：

1. 个人头像占位区（200x200 圆形）
2. 个人简介（2-3 段文字）
3. 技能标签云（CSS flex 布局，标签样式）
4. 社交链接（GitHub / Twitter / 邮箱 / 微信）
5. SEO metadata

#### 3.5-3.11 占位页面

所有占位页面复用 `components/placeholder.tsx` 组件：

```typescript
// 使用示例
<Placeholder
  title="原创音乐"
  number="贰"
  description="原创音乐作品展示与播放，正在筹备中。"
/>
```

每个占位页面的唯一差异：标题、序号、描述文字。

#### 3.12 app/not-found.tsx

- 禅意风格的 404 页面
- 标题："肆零肆"
- 副标题："你访问的页面不存在"
- 返回首页链接

#### 3.13 app/error.tsx

- `'use client'` 组件
- 错误信息展示 + 重新加载按钮
- 返回首页链接

### 验收标准

- [ ] 3 篇 MDX 文章在文章列表页正确显示
- [ ] 每篇文章详情页内容完整、排版正确
- [ ] 关于页完整渲染（头像、简介、标签云、社交链接）
- [ ] 7 个占位页面统一风格，各有正确标题和序号
- [ ] 自定义 404 页面在访问不存在路径时触发
- [ ] 错误边界页面在模拟错误时正确显示
- [ ] 所有页面 SEO metadata 正确
- [ ] 所有页面响应式布局正常
- [ ] `npm run build` 构建通过

---

## Sprint 4：订阅 + 法律

**目标**：邮件订阅功能可用，法律合规页面就位

**预估工期**：1-2 天

### 任务清单

| # | 任务 | 文件路径 | 复杂度 |
|---|------|----------|--------|
| 4.1 | 实现 Server Action | `lib/subscribe.ts` | 高 |
| 4.2 | 完善订阅表单（接入 Server Action） | `components/subscribe-form.tsx` | 中 |
| 4.3 | 首页集成订阅表单 | `app/page.tsx` | 低 |
| 4.4 | 文章详情页集成订阅表单 | `app/articles/[slug]/page.tsx` | 低 |
| 4.5 | 创建隐私政策页 | `app/privacy/page.tsx` | 中 |
| 4.6 | 创建使用条款页 | `app/terms/page.tsx` | 中 |

### 详细说明

#### 4.1 lib/subscribe.ts

完整实现：

1. `subscribe(payload: SubscribePayload): Promise<SubscribeResult>`
2. 服务端输入校验（邮箱格式 + consent）
3. Rate limiting（内存 Map，同一 IP 每分钟 ≤ 3 次）
4. Resend API 调用（`resend.contacts.create`）
5. 幂等处理（重复邮箱返回成功）
6. 错误分类（用户错误 vs 系统错误）

**前置条件**：

- 注册 Resend 账号
- 创建 Audience
- 获取 API Key 和 Audience ID
- 配置 `.env.local`

#### 4.2 components/subscribe-form.tsx 完善

从 Sprint 1 的静态 UI 升级为完整功能：

- 表单提交调用 Server Action
- 加载状态（按钮 disabled + 文案变更）
- 成功/失败消息展示
- 防止重复提交
- 成功后清空表单

```typescript
// 核心逻辑
'use client';

import { useState } from 'react';
import { subscribe } from '@/lib/subscribe';

export function SubscribeForm({ source }: { source: 'homepage' | 'article' | 'placeholder' }) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    const result = await subscribe({ email, source, consent });
    setMessage(result.message);
    setStatus(result.success ? 'success' : 'error');

    if (result.success) {
      setEmail('');
      setConsent(false);
    }
  }

  // ... JSX
}
```

#### 4.5 app/privacy/page.tsx

隐私政策需包含以下章节：

1. 信息收集范围
2. 信息使用目的
3. 信息存储方式（Resend 第三方服务）
4. 用户权利（查阅、更正、删除、退订）
5. Cookie 使用说明
6. 第三方服务说明
7. 政策更新方式
8. 联系方式

#### 4.6 app/terms/page.tsx

使用条款需包含以下章节：

1. 服务说明
2. 用户行为规范
3. 知识产权声明
4. 免责声明
5. 服务变更与终止
6. 争议解决

### 验收标准

- [ ] Resend 账号已创建，Audience 已配置
- [ ] 订阅表单可正常提交
- [ ] 提交成功后 Resend Audience 中出现对应联系人
- [ ] 重复提交同一邮箱返回成功提示而非报错
- [ ] 空邮箱 / 未勾选同意 / 格式错误邮箱 被正确拦截
- [ ] Rate limiting 生效（快速连续提交超过 3 次被拒绝）
- [ ] 首页、文章详情页、占位页均有订阅表单
- [ ] 隐私政策页面内容完整、包含 PIPL 合规条款
- [ ] 使用条款页面内容完整
- [ ] 所有订阅表单旁均有隐私政策链接和同意声明
- [ ] `npm run build` 构建通过

---

## Sprint 5：防护 + 部署

**目标**：完成内测防护、构建验证、Vercel 部署、管理文档

**预估工期**：1-2 天

### 任务清单

| # | 任务 | 文件路径 | 复杂度 |
|---|------|----------|--------|
| 5.1 | 确认内测防护（noindex） | `app/layout.tsx`, `app/robots.ts` | 低 |
| 5.2 | 创建环境变量文件 | `.env.example` | 低 |
| 5.3 | 全站构建验证 | 全项目 | 中 |
| 5.4 | 创建 GitHub 仓库并推送 | GitHub | 低 |
| 5.5 | Vercel 部署配置 | Vercel Dashboard | 中 |
| 5.6 | 部署后验证 | 线上 | 中 |
| 5.7 | 创建管理文档 | `admin-help.md` | 中 |

### 详细说明

#### 5.1 内测防护确认

逐一验证以下防护措施：

- [ ] 所有页面的 `<head>` 包含 `<meta name="robots" content="noindex, nofollow">`（通过根 layout 的 metadata）
- [ ] `app/robots.ts` 生成 `Disallow: /`
- [ ] sitemap 不暴露未上线模块
- [ ] 无 RSS feed（MVP 不生成）
- [ ] 占位页面也有 noindex 标记
- [ ] `.env.local` 不在 Git 仓库中

#### 5.3 全站构建验证

检查清单：

1. `npm run build` 无报错
2. `npm run lint` 无严重 warning
3. TypeScript 类型检查通过（`npx tsc --noEmit`）
4. 所有页面路由可访问
5. 所有静态资源加载正常
6. 无控制台错误
7. 无死链接（手动检查所有内部链接）

#### 5.5 Vercel 部署

步骤：

1. 在 Vercel 导入 GitHub 仓库
2. Framework Preset 自动检测为 Next.js
3. 配置环境变量（与 `.env.local` 相同的变量）
4. 点击部署
5. 等待构建完成，获取默认域名 `xxx.vercel.app`

#### 5.6 部署后验证

在线上环境逐一验证：

- [ ] 首页完整渲染
- [ ] 文章列表页正常
- [ ] 文章详情页正常
- [ ] 关于页正常
- [ ] 所有占位页正常
- [ ] 订阅表单提交成功
- [ ] 404 页面正常
- [ ] `https://xxx.vercel.app/robots.txt` 返回 Disallow: /
- [ ] `https://xxx.vercel.app/sitemap.xml` 正确
- [ ] 移动端布局正常（用手机访问）
- [ ] 页面加载速度可接受（< 3s）

#### 5.7 admin-help.md

创建根目录管理文档，包含：

1. **如何创建新文章**：路径 `content/articles/`，frontmatter 格式，slug 命名规则
2. **如何修改页面样式**：`app/globals.css` 中的 CSS Variables
3. **如何开启某个功能**：修改 `.env.local` 中的功能开关 + Vercel 环境变量
4. **如何部署更新**：`git push` → Vercel 自动部署
5. **所有功能开关列表**及作用说明
6. **常见问题**：构建失败排查、环境变量缺失处理

### 验收标准

- [ ] `npm run build` 在本地通过
- [ ] `npm run lint` 无严重问题
- [ ] TypeScript 类型检查通过
- [ ] GitHub 仓库已创建并推送
- [ ] Vercel 部署成功，可访问
- [ ] 线上所有页面功能正常
- [ ] robots.txt 禁止所有爬虫
- [ ] 订阅表单在线上可用（Resend 环境变量已配置）
- [ ] `admin-help.md` 内容完整
- [ ] `.env.example` 已提交到仓库

---

## Sprint 6：灰度准备

**目标**：功能开关系统完善，Preview 部署流程验证，内容管理文档补充

**预估工期**：1-2 天

### 任务清单

| # | 任务 | 文件路径 | 复杂度 |
|---|------|----------|--------|
| 6.1 | 完善功能开关与首页联动 | `lib/features.ts`, `app/page.tsx` | 中 |
| 6.2 | 首页六模块动态显隐 | `app/page.tsx` | 中 |
| 6.3 | 导航栏动态菜单项完善 | `components/nav.tsx` | 低 |
| 6.4 | Vercel Preview 部署验证 | Git branch → Vercel | 中 |
| 6.5 | 补充内容管理文档 | `admin-help.md` | 中 |
| 6.6 | 创建备用 API 路由骨架 | `app/api/subscribe/route.ts` | 低 |
| 6.7 | OG 图片预留方案 | `public/images/og-default.png` | 低 |
| 6.8 | 全站最终审查 | 全项目 | 中 |

### 详细说明

#### 6.1 功能开关与首页联动

当前首页所有模块是硬编码显示。需要改为：

- 六种内容形式区块：根据功能开关动态显隐
- OPC 工具箱：根据 `FEATURE_TOOLS` 显隐
- 会员计划：根据 `FEATURE_PRICING` 显隐
- 未启用的模块仍显示卡片，但标记为"即将推出"，链接到对应占位页面

#### 6.2 首页六模块动态显隐

```typescript
// 首页渲染逻辑
import { getAllFeatures, isFeatureEnabled } from '@/lib/features';

const features = getAllFeatures();

// 六种内容形式区块
{features.map(feature => (
  <ZenCard
    key={feature.key}
    title={feature.labelZh}
    href={feature.route}
    enabled={isFeatureEnabled(feature.key)}
  />
))}
```

#### 6.4 Vercel Preview 部署验证

验证 Git 分支工作流：

1. 创建 feature branch：`git checkout -b feature/new-module`
2. 推送分支：`git push -u origin feature/new-module`
3. Vercel 自动创建 Preview 部署
4. 在 Preview 环境验证功能
5. 合并到 main 后自动部署到生产环境

#### 6.5 补充内容管理文档

在 `admin-help.md` 中追加：

- **功能开关灰度流程**：如何通过 Vercel 环境变量开启某个功能
- **Preview 部署验证流程**
- **内容审核检查清单**：新文章发布前需要检查的项目
- **版本回滚流程**：Vercel Dashboard → Deployments → Rollback

#### 6.6 备用 API 路由骨架

```typescript
// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 预留：备用订阅 API 入口
  // 当 Server Action 不可用时的替代方案
  return NextResponse.json({ message: 'Not implemented yet' }, { status: 501 });
}
```

### 验收标准

- [ ] 首页模块根据功能开关正确显隐
- [ ] 未启用模块显示"即将推出"状态
- [ ] 导航栏菜单项与功能开关一致
- [ ] Git 分支推送后 Vercel Preview 部署成功
- [ ] Preview 环境与本地行为一致
- [ ] `admin-help.md` 包含灰度发布和回滚流程
- [ ] 备用 API 路由骨架存在
- [ ] 默认 OG 图片已放置
- [ ] 全站所有页面最终审查通过
- [ ] `npm run build` 通过
- [ ] TypeScript 类型检查通过

---

## 附录：Sprint 依赖关系

```
Sprint 1 (基础框架)
    ↓
Sprint 2 (文章系统) ← 依赖 Sprint 1 的布局和组件
    ↓
Sprint 3 (内容填充) ← 依赖 Sprint 2 的文章管道
    ↓
Sprint 4 (订阅+法律) ← 依赖 Sprint 1 的订阅表单组件
    ↓
Sprint 5 (防护+部署) ← 依赖 Sprint 1-4 的所有产出
    ↓
Sprint 6 (灰度准备) ← 依赖 Sprint 5 的部署环境
```

**注意**：Sprint 3 和 Sprint 4 理论上可以并行推进，因为它们没有直接依赖关系。但在单人开发场景下，建议串行执行。

---

## 附录：风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| Noto Serif SC 字体加载慢 | 中 | LCP 受影响 | `font-display: swap` + 子集化 + preload |
| Resend API 国内访问不稳定 | 中 | 订阅功能不可用 | 备用 API 路由 + 优雅降级提示 |
| MDX 编译失败 | 低 | 文章无法渲染 | Error Boundary 捕获 + 降级显示原文 |
| Vercel 部署失败 | 低 | 无法上线 | 本地 `npm run build` 预检 + 日志排查 |
| 功能开关遗漏 | 低 | 页面显示异常 | Sprint 6 专门做全站审查 |
