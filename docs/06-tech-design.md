# SOLO.X -- 技术设计文档

> 版本：v1.0 | 日期：2026-05-09
> 技术栈：Next.js 16 + TypeScript + App Router + 纯自定义 CSS + MDX
> 部署：Vercel（默认域名）

---

## 1. 系统架构

### 1.1 架构描述

```
                          ┌─────────────┐
                          │   Vercel    │
                          │  Edge CDN   │
                          └──────┬──────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Next.js 16 App      │
                    │     Router (SSG/SSR)     │
                    ├─────────────────────────┤
                    │  RSC (Server Components) │
                    │  Server Actions          │
                    │  API Routes (预留)        │
                    └─────┬──────────┬────────┘
                          │          │
              ┌───────────▼──┐  ┌────▼─────────┐
              │  文件系统     │  │  Resend API   │
              │  (MDX/CSS)   │  │  (邮件订阅)    │
              └──────────────┘  └──────────────┘
```

**核心数据流**：

1. **构建时 (SSG)**：Next.js 从 `content/articles/` 读取 MDX 文件，通过 `gray-matter` 解析 frontmatter，`next-mdx-remote/rsc` 编译 MDX 内容，生成静态页面
2. **运行时 (SSR)**：订阅表单提交触发 Server Action，调用 Resend API 发送邮件；所有页面元数据通过 `generateMetadata` 动态生成
3. **客户端**：仅订阅表单为客户端交互组件（`'use client'`），其余全部为 Server Component

**架构特点**：

- 零数据库：MVP 阶段所有内容存储在文件系统（MDX 文件），订阅数据由 Resend 管理
- 全静态生成：文章页面通过 `generateStaticParams` 预渲染，零运行时成本
- 最小客户端 JS：仅订阅表单组件需要客户端 JavaScript

### 1.2 渲染策略

| 页面 | 渲染方式 | 说明 |
|------|----------|------|
| 首页 `/` | SSG | 构建时生成，`revalidate` 无需配置 |
| 文章列表 `/articles` | SSG | 构建时生成 |
| 文章详情 `/articles/[slug]` | SSG + `generateStaticParams` | 每篇文章预渲染 |
| 关于页 `/about` | SSG | 静态页面 |
| 占位页面 (×7) | SSG | 静态页面 |
| 隐私/条款 | SSG | 静态页面 |
| 404 | SSG | 自定义错误页 |
| 订阅提交 | Server Action | 表单提交触发服务端函数 |

---

## 2. 目录结构

```
solo-x/
├── app/
│   ├── layout.tsx                 # 根布局：字体加载、全局 CSS、导航栏、Footer
│   ├── page.tsx                   # 首页
│   ├── globals.css                # 设计系统变量 + 全局样式
│   ├── not-found.tsx              # 自定义 404 页面
│   ├── error.tsx                  # 自定义 500 错误边界
│   ├── robots.ts                  # 动态生成 robots.txt（内测模式）
│   ├── sitemap.ts                 # 动态生成 sitemap.xml
│   │
│   ├── articles/
│   │   ├── page.tsx               # 文章列表页
│   │   └── [slug]/
│   │       └── page.tsx           # 文章详情页
│   │
│   ├── about/
│   │   └── page.tsx               # 关于页
│   │
│   ├── music/
│   │   └── page.tsx               # 占位：原创音乐
│   ├── courses/
│   │   └── page.tsx               # 占位：视频课程
│   ├── apps/
│   │   └── page.tsx               # 占位：微信小程序
│   ├── webapps/
│   │   └── page.tsx               # 占位：网页应用
│   ├── games/
│   │   └── page.tsx               # 占位：创意游戏
│   ├── tools/
│   │   └── page.tsx               # 占位：OPC 工具箱
│   ├── pricing/
│   │   └── page.tsx               # 占位：会员计划
│   ├── contact/
│   │   └── page.tsx               # 占位：联系页
│   │
│   ├── privacy/
│   │   └── page.tsx               # 隐私政策
│   ├── terms/
│   │   └── page.tsx               # 使用条款
│   │
│   └── api/                       # API 路由（预留）
│       └── subscribe/
│           └── route.ts           # 备用：订阅 API 路由
│
├── components/
│   ├── nav.tsx                    # 导航栏（毛玻璃效果）
│   ├── footer.tsx                 # 页脚
│   ├── ink-divider.tsx            # 墨线分隔符组件
│   ├── subscribe-form.tsx         # 订阅表单（'use client'）
│   ├── placeholder.tsx            # 占位页面统一模板
│   ├── article-card.tsx           # 文章卡片组件
│   └── zen-card.tsx               # 首页数据卡片组件
│
├── content/
│   └── articles/                  # MDX 文章源文件
│       ├── about-this-site.mdx
│       ├── who-am-i.mdx
│       └── ai-tools-for-creators.mdx
│
├── lib/
│   ├── articles.ts                # 文章读取/解析/排序/筛选
│   ├── subscribe.ts               # 订阅 Server Action（Resend 集成）
│   ├── features.ts                # 功能开关配置
│   ├── mdx.ts                     # MDX 编译配置（自定义组件映射）
│   └── constants.ts               # 站点常量（站点名、描述、社交链接等）
│
├── public/
│   ├── images/                    # 图片资源
│   │   ├── og-default.png         # 默认 OG 图片
│   │   └── avatar-placeholder.png # 头像占位
│   └── fonts/                     # 自托管字体文件（如需）
│
├── types/
│   └── article.ts                 # 文章相关 TypeScript 类型定义
│
├── docs/                          # 项目文档
│   ├── PRD.md
│   ├── 06-tech-design.md
│   ├── 07-implementation.md
│   └── 08-test-plan.md
│
├── next.config.ts
├── tsconfig.json
├── package.json
├── .env.local                     # 环境变量（不提交到 Git）
├── .env.example                   # 环境变量模板（提交到 Git）
├── .gitignore
└── admin-help.md                  # 内容管理说明
```

---

## 3. 数据模型

### 3.1 Article Frontmatter Schema

```typescript
// types/article.ts

export type ArticleType = 'essay' | 'note' | 'tool' | 'smidgeon' | 'now';

export interface ArticleFrontmatter {
  /** 文章标题，必填 */
  title: string;
  /** 发布日期，格式 YYYY-MM-DD，必填 */
  date: string;
  /** 内容类型，必填 */
  type: ArticleType;
  /** 标签数组，最多 5 个 */
  tags: string[];
  /** 文章摘要，150 字以内 */
  excerpt: string;
  /** 是否草稿，默认 false */
  draft?: boolean;
}

export interface Article {
  /** URL slug，从文件名派生 */
  slug: string;
  /** Frontmatter 数据 */
  frontmatter: ArticleFrontmatter;
  /** MDX 原始内容（不含 frontmatter） */
  content: string;
  /** 估算阅读时长（分钟） */
  readingTime: number;
}
```

**Frontmatter 校验规则**：

| 字段 | 规则 | 示例 |
|------|------|------|
| title | 非空字符串，≤100 字符 | `"我的第一篇文章"` |
| date | 有效日期格式 YYYY-MM-DD | `"2026-05-09"` |
| type | 枚举值之一 | `"essay"` |
| tags | 字符串数组，每项 ≤20 字符，最多 5 项 | `["AI", "工具"]` |
| excerpt | 非空字符串，≤150 字符 | `"这是一篇关于..."` |
| draft | 布尔值，缺省为 false | `true` |

### 3.2 订阅数据模型

```typescript
// 订阅提交 payload（客户端 → Server Action）
export interface SubscribePayload {
  /** 订阅者邮箱 */
  email: string;
  /** 来源页面标识 */
  source: 'homepage' | 'article' | 'placeholder';
  /** 用户已阅读并同意隐私政策 */
  consent: boolean;
}

// Server Action 返回结果
export interface SubscribeResult {
  success: boolean;
  message: string;
}

// Resend API 请求体
export interface ResendContactPayload {
  email: string;
  audience_id: string;
  first_name?: string;
  unsubscribed: boolean;
}
```

**订阅数据流**：

```
用户填写表单
    ↓
客户端校验（邮箱格式 + 同意勾选）
    ↓
Server Action (subscribe.ts)
    ├── 服务端校验（重复校验 + rate limiting）
    ├── 调用 Resend API（POST /audiences/{id}/contacts）
    └── 返回结果
```

### 3.3 功能开关 Schema

```typescript
// lib/features.ts

export type FeatureKey =
  | 'ARTICLES'
  | 'MUSIC'
  | 'COURSES'
  | 'APPS'
  | 'WEBAPPS'
  | 'GAMES'
  | 'TOOLS'
  | 'PRICING'
  | 'MEMBERS';

interface FeatureConfig {
  key: FeatureKey;
  label: string;
  labelZh: string;        // 中文标签（序号 + 名称）
  route: string;
  enabled: boolean;
  icon: string;           // 汉字序号：壹贰叁肆伍陆
}

// 所有功能开关的定义
const FEATURES: FeatureConfig[] = [
  { key: 'ARTICLES',  label: 'Articles',  labelZh: '壹·深度文章', route: '/articles',  enabled: true,  icon: '壹' },
  { key: 'MUSIC',     label: 'Music',     labelZh: '贰·原创音乐', route: '/music',     enabled: false, icon: '贰' },
  { key: 'COURSES',   label: 'Courses',   labelZh: '叁·视频课程', route: '/courses',   enabled: false, icon: '叁' },
  { key: 'APPS',      label: 'Mini Apps', labelZh: '肆·小程序',   route: '/apps',      enabled: false, icon: '肆' },
  { key: 'WEBAPPS',   label: 'Web Apps',  labelZh: '伍·网页应用', route: '/webapps',   enabled: false, icon: '伍' },
  { key: 'GAMES',     label: 'Games',     labelZh: '陆·创意游戏', route: '/games',     enabled: false, icon: '陆' },
];

// 从环境变量读取开关状态
export function isFeatureEnabled(key: FeatureKey): boolean {
  return process.env[`NEXT_PUBLIC_FEATURE_${key}`] === 'true';
}

// 获取所有已启用的功能
export function getEnabledFeatures(): FeatureConfig[] {
  return FEATURES.filter(f => isFeatureEnabled(f.key));
}

// 获取所有功能（含禁用，用于首页展示）
export function getAllFeatures(): FeatureConfig[] {
  return FEATURES;
}
```

---

## 4. API 设计

### 4.1 Server Actions

MVP 阶段仅需要一个 Server Action，所有数据交互通过文件系统完成。

#### `subscribe(payload: SubscribePayload): Promise<SubscribeResult>`

**文件**：`lib/subscribe.ts`

```typescript
'use server';

import { Resend } from 'resend';
import { SubscribePayload, SubscribeResult } from '@/types/article';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export async function subscribe(payload: SubscribePayload): Promise<SubscribeResult> {
  // 1. 服务端校验
  if (!payload.email || !payload.consent) {
    return { success: false, message: '请填写邮箱并同意隐私政策' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email)) {
    return { success: false, message: '邮箱格式不正确' };
  }

  // 2. 调用 Resend API
  try {
    const { error } = await resend.contacts.create({
      email: payload.email,
      audienceId: AUDIENCE_ID!,
    });

    if (error) {
      if (error.message?.includes('already exists')) {
        return { success: true, message: '您已订阅，感谢关注！' };
      }
      return { success: false, message: '订阅失败，请稍后重试' };
    }

    return { success: true, message: '订阅成功！感谢您的关注。' };
  } catch {
    return { success: false, message: '服务暂时不可用，请稍后重试' };
  }
}
```

### 4.2 API 路由（预留骨架）

以下路由在 MVP 阶段不实现，仅保留文件结构说明：

| 路由 | 方法 | 用途 | MVP 状态 |
|------|------|------|----------|
| `/api/subscribe` | POST | 订阅备用入口 | 预留 |
| `/api/og` | GET | 动态 OG 图片生成 | 预留 |
| `/api/webhook` | POST | 支付/订阅 Webhook | 预留 |

---

## 5. 内容系统设计

### 5.1 MDX 解析流程

```
content/articles/*.mdx
        ↓
  fs.readFileSync (Node.js API)
        ↓
  gray-matter 解析 frontmatter
        ↓
  ├── frontmatter 数据 → 校验 → 类型转换
  └── content 正文 → next-mdx-remote/rsc compileMDX
        ↓
  返回 Article 对象（slug + frontmatter + content + readingTime）
```

### 5.2 文章读取/排序/筛选逻辑

```typescript
// lib/articles.ts

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article, ArticleFrontmatter, ArticleType } from '@/types/article';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

/** 获取所有文章（排除草稿） */
export function getAllArticles(): Article[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx'));

  const articles = files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);

    return {
      slug,
      frontmatter: data as ArticleFrontmatter,
      content,
      readingTime: calculateReadingTime(content),
    };
  });

  // 过滤草稿
  return articles
    .filter(a => !a.frontmatter.draft)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

/** 按 slug 获取单篇文章 */
export function getArticleBySlug(slug: string): Article | undefined {
  const allArticles = getAllArticles();
  return allArticles.find(a => a.slug === slug);
}

/** 按类型筛选文章 */
export function getArticlesByType(type: ArticleType | 'all'): Article[] {
  const articles = getAllArticles();
  if (type === 'all') return articles;
  return articles.filter(a => a.frontmatter.type === type);
}

/** 获取所有标签 */
export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tags = new Set<string>();
  articles.forEach(a => a.frontmatter.tags?.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

/** 获取所有已用 slug（用于 generateStaticParams） */
export function getAllSlugs(): string[] {
  return getAllArticles().map(a => a.slug);
}

/** 计算阅读时长（中文：400字/分钟） */
function calculateReadingTime(content: string): number {
  const chineseChars = (content.match(/[一-鿿]/g) || []).length;
  const englishWords = content.replace(/[一-鿿]/g, '').split(/\s+/).filter(Boolean).length;
  const totalMinutes = chineseChars / 400 + englishWords / 200;
  return Math.max(1, Math.ceil(totalMinutes));
}
```

### 5.3 MDX 渲染配置

```typescript
// lib/mdx.ts

import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="article-h1" {...props} />,
  h2: (props) => <h2 className="article-h2" {...props} />,
  h3: (props) => <h3 className="article-h3" {...props} />,
  p: (props) => <p className="article-p" {...props} />,
  a: (props) => <a className="article-link" target="_blank" rel="noopener noreferrer" {...props} />,
  ul: (props) => <ul className="article-ul" {...props} />,
  ol: (props) => <ol className="article-ol" {...props} />,
  li: (props) => <li className="article-li" {...props} />,
  blockquote: (props) => <blockquote className="article-blockquote" {...props} />,
  pre: (props) => <pre className="article-pre" {...props} />,
  code: (props) => <code className="article-code" {...props} />,
  img: (props) => (
    <img
      className="article-img"
      loading="lazy"
      {...props}
    />
  ),
};
```

### 5.4 文章详情页 MDX 渲染方式

采用 `next-mdx-remote/rsc` 的 `compileMDX` 方式，而非 Next.js 内置 MDX loader：

```typescript
// app/articles/[slug]/page.tsx（核心逻辑）

import { compileMDX } from 'next-mdx-remote/rsc';
import { getArticleBySlug, getAllSlugs } from '@/lib/articles';
import { mdxComponents } from '@/lib/mdx';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { content } = await compileMDX({
    source: article.content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  return (
    <article className="article-detail">
      <header>
        <h1>{article.frontmatter.title}</h1>
        <div className="article-meta">
          <time>{article.frontmatter.date}</time>
          <span>{article.readingTime} 分钟</span>
          {article.frontmatter.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </header>
      <div className="article-body">{content}</div>
    </article>
  );
}
```

**为什么选择 `next-mdx-remote/rsc` 而非 Next.js 内置 MDX**：

1. 文章内容从文件系统动态读取，而非静态 import
2. 支持 frontmatter 解析（通过 gray-matter 预处理）
3. RSC 模式下 `compileMDX` 直接返回 React 元素，无需序列化步骤
4. 可以在 `generateMetadata` 中复用同一套文章读取逻辑

---

## 6. 订阅系统设计

### 6.1 Resend 集成流程

```
┌──────────────────────────────────────────────────┐
│                  准备阶段                          │
│  1. 注册 Resend 謔号 → resend.com                 │
│  2. 创建 Audience → 获取 audience_id              │
│  3. 生成 API Key → 存入 .env.local               │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                  运行时流程                        │
│                                                   │
│  用户提交表单                                      │
│      ↓                                            │
│  SubscribeForm (client component)                 │
│    ├── 表单校验（邮箱 + consent）                   │
│    ├── 按钮置 loading 状态                         │
│    └── 调用 Server Action                         │
│              ↓                                    │
│  subscribe() (server action)                      │
│    ├── 二次校验邮箱格式                             │
│    ├── 调用 Resend API: contacts.create()          │
│    │   └── POST /audiences/{id}/contacts           │
│    └── 返回 SubscribeResult                       │
│              ↓                                    │
│  SubscribeForm 显示结果消息                        │
│    ├── 成功 → 显示成功提示                         │
│    └── 失败 → 显示错误信息 + 重试按钮               │
└──────────────────────────────────────────────────┘
```

### 6.2 Server Action 架构

**设计原则**：

1. **单一入口**：所有订阅请求走同一个 Server Action，便于维护和加 rate limiting
2. **服务端校验**：不信任客户端数据，服务端必须重新校验
3. **幂等处理**：重复邮箱返回成功而非报错
4. **错误分类**：区分用户错误（格式错误）和系统错误（API 故障）

### 6.3 表单校验规则

| 校验项 | 位置 | 规则 |
|--------|------|------|
| 邮箱格式 | 客户端 + 服务端 | RFC 5322 简化正则 |
| 邮箱长度 | 客户端 + 服务端 | ≤ 254 字符 |
| 同意声明 | 客户端 | 必须勾选 |
| 提交频率 | 服务端 | 同一 IP 每分钟 ≤ 3 次 |

**Rate Limiting 实现**（MVP 使用内存 Map）：

```typescript
// lib/subscribe.ts（续）

const submitAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = submitAttempts.get(ip);

  if (!record || now > record.resetAt) {
    submitAttempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (record.count >= 3) return false;
  record.count++;
  return true;
}
```

> 注意：内存 Map 在 Vercel Serverless 环境中每次冷启动会重置。MVP 阶段可接受此限制，后续可迁移至 Vercel KV。

---

## 7. SEO 策略

### 7.1 Metadata 生成

**根布局默认 Metadata**（`app/layout.tsx`）：

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'SOLO.X — 一人公司创作平台',
    template: '%s | SOLO.X',
  },
  description: '独立创作者的内容平台，汇聚文章、工具、课程与灵感',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://solo-x.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'SOLO.X',
    images: ['/images/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: false,    // 内测期禁止索引
    follow: false,
  },
  alternates: {
    canonical: '/',
  },
};
```

**文章详情页动态 Metadata**：

```typescript
// app/articles/[slug]/page.tsx

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const { frontmatter } = article;
  const url = `/articles/${slug}`;

  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: 'article',
      publishedTime: frontmatter.date,
      tags: frontmatter.tags,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.excerpt,
    },
    alternates: {
      canonical: url,
    },
  };
}
```

### 7.2 JSON-LD 结构化数据

```typescript
// 在文章详情页的 <head> 中注入

function generateArticleJsonLd(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.frontmatter.title,
    description: article.frontmatter.excerpt,
    datePublished: article.frontmatter.date,
    author: {
      '@type': 'Person',
      name: 'SOLO.X',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'SOLO.X',
    },
    keywords: article.frontmatter.tags.join(', '),
    inLanguage: 'zh-CN',
  };
}

// 使用方式（在 page.tsx 中）：
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

### 7.3 OG Image 策略

**MVP 方案**：使用静态默认图片 `public/images/og-default.png`

**后续优化**：通过 `next/og` (ImageResponse) 动态生成每篇文章的 OG 图片：

```typescript
// 预留：app/api/og/route.ts
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'SOLO.X';
  // 生成动态 OG 图片...
}
```

### 7.4 Sitemap

```typescript
// app/sitemap.ts

import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solo-x.vercel.app';

  const articleUrls = getAllSlugs().map(slug => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...articleUrls,
  ];
}
```

### 7.5 Robots.txt

```typescript
// app/robots.ts

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // 内测期：禁止所有爬虫
      disallow: '/',
    },
    // 上线后改为：
    // rules: { userAgent: '*', allow: '/', disallow: '/api/' },
  };
}
```

---

## 8. 安全设计

### 8.1 PIPL（个人信息保护法）合规

| 要求 | 实现方式 |
|------|----------|
| 知情同意 | 订阅表单旁显示隐私政策链接，勾选同意后才能提交 |
| 最小必要 | 仅收集邮箱地址，不收集其他个人信息 |
| 目的限制 | 明确声明邮箱仅用于内容更新通知 |
| 存储安全 | 数据存储在 Resend（第三方服务），不本地存储 |
| 删除权 | 提供退订链接（每封邮件底部），支持手动退订请求 |
| 隐私政策 | `/privacy` 页面完整披露数据收集和使用方式 |

### 8.2 输入校验

```typescript
// 服务端校验函数
function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: '邮箱不能为空' };
  }
  if (email.length > 254) {
    return { valid: false, error: '邮箱长度超出限制' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: '邮箱格式不正确' };
  }
  return { valid: true };
}
```

### 8.3 Rate Limiting

- **订阅表单**：同一 IP 每分钟最多 3 次提交
- **实现方式**：内存 Map（MVP），后续迁移至 Vercel KV
- **Vercel 自带防护**：Vercel 平台自带 DDoS 防护和请求限速

### 8.4 API Key 管理

```bash
# .env.local（不提交到 Git）
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# .env.example（提交到 Git，不含真实值）
RESEND_API_KEY=your_resend_api_key_here
RESEND_AUDIENCE_ID=your_resend_audience_id_here
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
NEXT_PUBLIC_SITE_NAME=SOLO.X
NEXT_PUBLIC_FEATURE_ARTICLES=true
# ... 其他功能开关
```

**安全规则**：

1. 所有带 `RESEND_` 前缀的变量仅在服务端使用，不暴露给客户端
2. `.env.local` 加入 `.gitignore`
3. Vercel 部署时在项目设置中配置环境变量
4. API Key 仅在 Server Action 中引用，不传递到客户端组件

---

## 9. 性能策略

### 9.1 Core Web Vitals 目标

| 指标 | 目标值 | 策略 |
|------|--------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 预加载关键字体、避免大图、SSG 预渲染 |
| FID (First Input Delay) | ≤ 100ms | 最小化客户端 JS、减少第三方脚本 |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 字体 `font-display: swap`、图片预设尺寸 |
| INP (Interaction to Next Paint) | ≤ 200ms | 订阅表单交互优化 |

### 9.2 字体加载策略

```typescript
// app/layout.tsx

import { Noto_Serif_SC, Noto_Sans_SC, IBM_Plex_Mono } from 'next/font/google';

const notoSerif = Noto_Serif_SC({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

const notoSans = Noto_Sans_SC({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
```

**优化要点**：

- 使用 `next/font/google` 自动优化字体加载
- `display: swap` 避免 FOIT（Flash of Invisible Text）
- 仅 preload 正文和标题字体，等宽字体延迟加载
- Shippori Mincho 字体如果 Google Fonts 不提供，降级为 serif 系统 fallback

### 9.3 图片优化

```typescript
// 使用 Next.js Image 组件
import Image from 'next/image';

<Image
  src="/images/avatar-placeholder.png"
  alt="头像"
  width={200}
  height={200}
  priority={false}       // 非首屏图片延迟加载
  placeholder="blur"     // 模糊占位
  blurDataURL="..."      // 占位 data URL
/>;
```

**图片规则**：

1. 所有图片使用 `next/image` 组件，自动 WebP/AVIF 转换
2. 首屏图片设置 `priority={true}`
3. 文章内图片使用原生 `<img>` 标签（MDX 渲染限制），添加 `loading="lazy"`
4. 图片资源存放在 `public/images/`，构建时由 Vercel 自动优化

### 9.4 CSS 性能

- 使用 CSS Variables 定义设计系统，避免运行时计算
- 全局样式在 `globals.css` 中一次性加载
- 组件样式使用 BEM 命名，避免嵌套过深
- `fadeIn` 动画使用 `transform` 和 `opacity`（GPU 加速），避免触发 layout

---

## 10. 环境变量清单

| 变量名 | 作用 | 示例值 | 必填 | 位置 |
|--------|------|--------|------|------|
| `RESEND_API_KEY` | Resend 邮件服务 API Key | `re_xxxxx` | MVP 必须 | 仅服务端 |
| `RESEND_AUDIENCE_ID` | Resend 受众列表 ID | `uuid` | MVP 必须 | 仅服务端 |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL（用于 SEO） | `https://xxx.vercel.app` | 是 | 客户端+服务端 |
| `NEXT_PUBLIC_SITE_NAME` | 站点名称 | `SOLO.X` | 是 | 客户端 |
| `NEXT_PUBLIC_FEATURE_ARTICLES` | 文章功能开关 | `true` | 是 | 客户端 |
| `NEXT_PUBLIC_FEATURE_MUSIC` | 音乐功能开关 | `false` | 是 | 客户端 |
| `NEXT_PUBLIC_FEATURE_COURSES` | 课程功能开关 | `false` | 是 | 客户端 |
| `NEXT_PUBLIC_FEATURE_APPS` | 小程序功能开关 | `false` | 是 | 客户端 |
| `NEXT_PUBLIC_FEATURE_WEBAPPS` | 网页应用功能开关 | `false` | 是 | 客户端 |
| `NEXT_PUBLIC_FEATURE_GAMES` | 游戏功能开关 | `false` | 是 | 客户端 |
| `NEXT_PUBLIC_FEATURE_TOOLS` | 工具功能开关 | `false` | 是 | 客户端 |
| `NEXT_PUBLIC_FEATURE_PRICING` | 定价功能开关 | `false` | 是 | 客户端 |
| `NEXT_PUBLIC_FEATURE_MEMBERS` | 会员功能开关 | `false` | 是 | 客户端 |

---

## 11. 依赖包清单及版本

### 11.1 生产依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `next` | `16.x` | React 全栈框架 |
| `react` | `19.x` | UI 库 |
| `react-dom` | `19.x` | React DOM 渲染 |
| `next-mdx-remote` | `^5.0.0` | MDX 远程内容渲染（RSC 支持） |
| `gray-matter` | `^4.0.3` | Frontmatter 解析 |
| `resend` | `^4.0.0` | Resend 邮件服务 SDK |

### 11.2 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `typescript` | `^5.x` | TypeScript 编译器 |
| `@types/node` | `^20.x` | Node.js 类型定义 |
| `@types/react` | `^19.x` | React 类型定义 |
| `@types/react-dom` | `^19.x` | React DOM 类型定义 |
| `eslint` | `^9.x` | 代码检查 |
| `eslint-config-next` | `16.x` | Next.js ESLint 规则 |

### 11.3 后续迭代可能引入

| 包名 | 用途 | 引入阶段 |
|------|------|----------|
| `@sentry/nextjs` | 错误监控 | MVP 后 |
| `@waline/client` | 评论系统 | MVP 后 |
| `pagefind` | 站内搜索 | MVP 后 |
| `sharp` | 图片处理（OG 生成） | MVP 后 |
| `reading-time` | 阅读时长计算（如果自实现不够准确） | 按需 |

---

## 12. 错误处理策略

### 12.1 404 页面

```typescript
// app/not-found.tsx

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">肆零肆</h1>
        <p className="error-message">你访问的页面不存在</p>
        <p className="error-hint">可能已被移动、重命名，或从未存在</p>
        <a href="/" className="error-link">返回首页</a>
      </div>
    </div>
  );
}
```

**设计要求**：

- 使用禅意设计风格，与全站一致
- 标题使用 "肆零肆"（中文数字风格），与 SOLO.X 品牌一致
- 提供明确的返回首页链接

### 12.2 500 错误边界

```typescript
// app/error.tsx

'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-title">出了点问题</h1>
        <p className="error-message">页面加载时发生了错误</p>
        <button onClick={reset} className="error-link">重新加载</button>
        <a href="/" className="error-link-secondary">返回首页</a>
      </div>
    </div>
  );
}
```

### 12.3 Sentry 集成预留

MVP 阶段不集成 Sentry，但预留以下结构：

```typescript
// 预留：lib/monitoring.ts
// MVP 后引入 @sentry/nextjs

// 1. next.config.ts 中添加 Sentry webpack 插件
// 2. sentry.client.config.ts — 客户端错误捕获
// 3. sentry.server.config.ts — 服务端错误捕获
// 4. sentry.edge.config.ts — Edge 运行时错误捕获

// 环境变量预留：
// SENTRY_DSN=your_sentry_dsn
// SENTRY_ORG=your_org
// SENTRY_PROJECT=your_project
```

### 12.4 错误处理清单

| 场景 | 处理方式 | 用户看到的信息 |
|------|----------|----------------|
| 文章 slug 不存在 | `notFound()` 触发 404 页面 | "肆零肆" 页面 |
| MDX 编译失败 | Error Boundary 捕获 | "出了点问题" + 重试按钮 |
| Resend API 失败 | Server Action 返回错误 | "服务暂时不可用，请稍后重试" |
| 网络断开 | 客户端 fetch 失败捕获 | "网络连接失败，请检查网络" |
| 环境变量缺失 | 构建时类型检查 + 运行时降级 | 订阅表单隐藏或显示"即将上线" |

---

## 附录 A：关键技术决策记录

| 决策 | 选项 | 结论 | 原因 |
|------|------|------|------|
| CSS 方案 | Tailwind / CSS Modules / 纯自定义 CSS | 纯自定义 CSS | 设计高度定制，Tailwind 的 utility-first 与禅意设计冲突 |
| MDX 方案 | @next/mdx / next-mdx-remote | next-mdx-remote/rsc | 需要动态读取文件 + frontmatter 解析 |
| 邮件服务 | Brevo / Resend / SendGrid | Resend | API 简洁、Next.js 集成好、免费 100 封/天 |
| 字体加载 | Google CDN / 自托管 | next/font/google | 自动子集化 + preload + swap |
| 部署平台 | Vercel / Cloudflare Pages | Vercel | 与 Next.js 深度集成、零配置部署 |
| 评论系统 | Giscus / Waline | Waline（MVP 后） | 中文用户友好、不依赖 GitHub |

## 附录 B：Vercel 部署配置

```
框架预设：Next.js（自动检测）
构建命令：next build
输出目录：.next（默认）
Node.js 版本：20.x
环境变量：在 Vercel Dashboard → Settings → Environment Variables 中配置
```

无需额外 `vercel.json` 配置，零配置部署。
