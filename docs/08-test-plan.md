# SOLO.X -- 测试计划

> 版本：v1.0 | 日期：2026-05-09
> 测试范围：MVP 阶段（Sprint 1 - Sprint 6）
> 测试工具：Vitest + React Testing Library + Playwright

---

## 1. 测试策略

### 1.1 测试层级

| 层级 | 范围 | 工具 | 占比 | 运行时机 |
|------|------|------|------|----------|
| 单元测试 | 工具函数、数据转换、校验逻辑 | Vitest | 50% | 每次提交 |
| 集成测试 | 组件渲染、Server Action、页面组装 | Vitest + React Testing Library | 30% | 每次提交 |
| E2E 测试 | 关键用户流程（浏览文章、提交订阅） | Playwright | 20% | 合并到 main 前 |

### 1.2 测试原则

1. **工具函数必须有单元测试**：`lib/articles.ts`、`lib/subscribe.ts`、`lib/features.ts` 的所有导出函数
2. **组件测行为不测实现**：验证用户可见的输出和交互，不测内部 state
3. **关键路径必须有 E2E**：首页加载、文章浏览、订阅提交是三条核心路径
4. **不测试第三方库**：Resend SDK、next-mdx-remote、gray-matter 的内部逻辑
5. **快照测试谨慎使用**：仅用于稳定的配置文件，不用于 UI 组件

### 1.3 测试文件组织

```
__tests__/
├── unit/
│   ├── articles.test.ts         # lib/articles.ts 的测试
│   ├── features.test.ts         # lib/features.ts 的测试
│   ├── subscribe.test.ts        # lib/subscribe.ts 的校验逻辑测试
│   └── constants.test.ts        # 站点常量测试
├── integration/
│   ├── article-card.test.tsx     # 文章卡片渲染测试
│   ├── subscribe-form.test.tsx   # 订阅表单交互测试
│   ├── nav.test.tsx              # 导航栏测试
│   ├── placeholder.test.tsx      # 占位页面模板测试
│   └── article-page.test.tsx     # 文章详情页集成测试
└── e2e/
    ├── homepage.spec.ts          # 首页 E2E
    ├── articles.spec.ts          # 文章浏览 E2E
    └── subscribe.spec.ts         # 订阅流程 E2E
```

---

## 2. 测试工具选型

### 2.1 Vitest

**选择原因**：

- 与 Vite 生态统一配置，Next.js 内建支持
- 比 Jest 启动更快，watch 模式体验更好
- 原生 ESM 支持，无需额外配置
- 兼容 Jest API，迁移成本低

**配置要点**：

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts', 'components/**/*.tsx'],
      exclude: ['**/*.d.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

### 2.2 React Testing Library

**选择原因**：

- 以用户视角测试组件，不依赖实现细节
- 与 Vitest 无缝集成
- 社区标准，文档丰富

**配置要点**：

```typescript
// __tests__/setup.ts
import '@testing-library/jest-dom/vitest';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  redirect: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));
```

### 2.3 Playwright

**选择原因**：

- 跨浏览器测试（Chromium / Firefox / WebKit）
- 自动等待机制，减少 flaky test
- 支持 mobile viewport 模拟
- 内置截图和 trace 录制

**配置要点**：

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 3. 测试覆盖范围

### 3.1 Sprint 1（基础框架）测试任务

| # | 测试项 | 类型 | 文件 |
|---|--------|------|------|
| 1.1 | 功能开关 `isFeatureEnabled` 正确读取环境变量 | 单元 | `unit/features.test.ts` |
| 1.2 | 功能开关 `getEnabledFeatures` 过滤正确 | 单元 | `unit/features.test.ts` |
| 1.3 | 导航栏根据功能开关显示/隐藏菜单项 | 集成 | `integration/nav.test.tsx` |
| 1.4 | 墨线分隔符渲染正确结构 | 集成 | `integration/ink-divider.test.tsx` |
| 1.5 | 占位页面模板渲染正确内容 | 集成 | `integration/placeholder.test.tsx` |
| 1.6 | 订阅表单 UI 元素完整（输入框、复选框、按钮） | 集成 | `integration/subscribe-form.test.tsx` |
| 1.7 | 首页包含所有预期区块 | E2E | `e2e/homepage.spec.ts` |

### 3.2 Sprint 2（文章系统）测试任务

| # | 测试项 | 类型 | 文件 |
|---|--------|------|------|
| 2.1 | `getAllArticles` 正确读取和排序文章 | 单元 | `unit/articles.test.ts` |
| 2.2 | `getArticleBySlug` 找到/找不到文章 | 单元 | `unit/articles.test.ts` |
| 2.3 | `getArticlesByType` 按类型筛选正确 | 单元 | `unit/articles.test.ts` |
| 2.4 | `getAllTags` 聚合标签正确 | 单元 | `unit/articles.test.ts` |
| 2.5 | `calculateReadingTime` 估算合理 | 单元 | `unit/articles.test.ts` |
| 2.6 | 草稿文章被过滤 | 单元 | `unit/articles.test.ts` |
| 2.7 | 文章卡片渲染标题、摘要、标签、时间 | 集成 | `integration/article-card.test.tsx` |
| 2.8 | 文章详情页渲染 MDX 内容 | 集成 | `integration/article-page.test.tsx` |
| 2.9 | 文章详情页 SEO metadata 正确 | 集成 | `integration/article-page.test.tsx` |
| 2.10 | 文章列表页类型筛选功能 | E2E | `e2e/articles.spec.ts` |

### 3.3 Sprint 3（内容填充）测试任务

| # | 测试项 | 类型 | 文件 |
|---|--------|------|------|
| 3.1 | 3 篇文章的 frontmatter 格式正确 | 单元 | `unit/articles.test.ts`（追加） |
| 3.2 | 所有文章 slug 可访问 | 集成 | `integration/article-page.test.tsx`（追加） |
| 3.3 | 关于页渲染完整内容 | E2E | `e2e/homepage.spec.ts`（追加） |
| 3.4 | 所有占位页面可访问 | E2E | `e2e/homepage.spec.ts`（追加） |
| 3.5 | 404 页面在无效路径触发 | E2E | `e2e/homepage.spec.ts`（追加） |

### 3.4 Sprint 4（订阅+法律）测试任务

| # | 测试项 | 类型 | 文件 |
|---|--------|------|------|
| 4.1 | 邮箱格式校验（有效/无效邮箱） | 单元 | `unit/subscribe.test.ts` |
| 4.2 | consent 未勾选时拒绝提交 | 单元 | `unit/subscribe.test.ts` |
| 4.3 | rate limiting 超限拒绝 | 单元 | `unit/subscribe.test.ts` |
| 4.4 | 订阅表单提交成功流程 | 集成 | `integration/subscribe-form.test.tsx` |
| 4.5 | 订阅表单提交失败流程 | 集成 | `integration/subscribe-form.test.tsx` |
| 4.6 | 隐私政策页面可访问 | E2E | `e2e/subscribe.spec.ts`（追加） |
| 4.7 | 完整订阅流程 E2E | E2E | `e2e/subscribe.spec.ts` |

### 3.5 Sprint 5-6 测试任务

| # | 测试项 | 类型 | 文件 |
|---|--------|------|------|
| 5.1 | robots.txt 返回 Disallow: / | 集成 | `integration/seo.test.ts` |
| 5.2 | sitemap.xml 格式正确 | 集成 | `integration/seo.test.ts` |
| 5.3 | 所有页面包含 noindex meta | 集成 | `integration/seo.test.ts` |
| 6.1 | 功能开关切换后首页模块正确显隐 | E2E | `e2e/homepage.spec.ts`（追加） |
| 6.2 | 导航栏菜单项与功能开关同步 | 集成 | `integration/nav.test.tsx`（追加） |

---

## 4. 关键测试用例清单

### 4.1 文章模块

| 用例 ID | 描述 | 前置条件 | 步骤 | 预期结果 |
|---------|------|----------|------|----------|
| ART-001 | 文章列表按日期倒序排列 | 至少 3 篇文章 | 访问 `/articles` | 第一篇文章日期最新 |
| ART-002 | 按类型筛选文章 | 含不同类型文章 | 点击 "Essay" 筛选 | 仅显示 essay 类型文章 |
| ART-003 | 文章详情页渲染 MDX | 存在 slug=hello-world 的文章 | 访问 `/articles/hello-world` | 标题、日期、标签、正文正确显示 |
| ART-004 | 文章详情页代码高亮 | 文章含代码块 | 查看文章中代码块 | 代码块有 `.article-pre` 样式 |
| ART-005 | 不存在文章返回 404 | 无 slug=not-exist 的文章 | 访问 `/articles/not-exist` | 显示自定义 404 页面 |
| ART-006 | 草稿文章不显示 | 有一篇 draft=true 的文章 | 访问 `/articles` | 草稿文章不在列表中 |
| ART-007 | 阅读时长计算 | 400 字中文文章 | 查看文章详情 | 显示 "1 分钟" |
| ART-008 | 文章标签聚合 | 多篇文章有不同标签 | 查看 `getAllTags()` | 返回去重排序后的标签列表 |

### 4.2 订阅模块

| 用例 ID | 描述 | 前置条件 | 步骤 | 预期结果 |
|---------|------|----------|------|----------|
| SUB-001 | 有效邮箱订阅成功 | Resend 可用 | 填写有效邮箱 + 勾选同意 + 提交 | 显示"订阅成功" |
| SUB-002 | 重复邮箱订阅 | 已订阅邮箱 | 再次提交 | 显示"您已订阅，感谢关注" |
| SUB-003 | 无效邮箱被拦截 | — | 填写 "not-email" + 提交 | 显示"邮箱格式不正确" |
| SUB-004 | 未勾选同意 | — | 填写邮箱 + 不勾选同意 + 提交 | 提交被阻止 |
| SUB-005 | 空邮箱被拦截 | — | 不填邮箱 + 提交 | 显示"请填写邮箱" |
| SUB-006 | Rate limiting 生效 | — | 同一邮箱/IP 连续提交 4 次 | 第 4 次被拒绝 |
| SUB-007 | 提交中按钮禁用 | — | 填写邮箱 + 提交 | 按钮显示 loading 状态且不可再次点击 |
| SUB-008 | 订阅表单在各页面存在 | — | 遍历首页/文章/占位页 | 均有订阅表单 |

### 4.3 功能开关

| 用例 ID | 描述 | 前置条件 | 步骤 | 预期结果 |
|---------|------|----------|------|----------|
| FEA-001 | 文章开关开启 | `FEATURE_ARTICLES=true` | 查看导航栏 | 显示"创作"链接 |
| FEA-002 | 工具开关关闭 | `FEATURE_TOOLS=false` | 查看导航栏 | 不显示"工具"链接 |
| FEA-003 | 首页模块显隐 | 部分 true 部分 false | 查看首页 | 已启用模块可点击，未启用显示"即将推出" |
| FEA-004 | 关于页始终显示 | `FEATURE_ARTICLES=false` | 查看导航栏 | "关于"链接始终存在 |

### 4.4 SEO

| 用例 ID | 描述 | 前置条件 | 步骤 | 预期结果 |
|---------|------|----------|------|----------|
| SEO-001 | 文章详情页有 meta title | 文章存在 | 查看 `<head>` | title 包含文章标题 |
| SEO-002 | 文章详情页有 meta description | 文章存在 | 查看 `<head>` | description 包含 excerpt |
| SEO-003 | 文章详情页有 JSON-LD | 文章存在 | 查看 `<head>` | 有 `@type: Article` 的 JSON-LD |
| SEO-004 | 文章详情页有 OG tags | 文章存在 | 查看 `<head>` | og:title、og:description 正确 |
| SEO-005 | 内测期 noindex | — | 查看任意页面 | `<meta name="robots" content="noindex, nofollow">` |
| SEO-006 | robots.txt 禁止所有 | — | 访问 `/robots.txt` | `Disallow: /` |
| SEO-007 | sitemap.xml 格式正确 | — | 访问 `/sitemap.xml` | 包含首页、文章列表、文章详情 URL |

### 4.5 导航与布局

| 用例 ID | 描述 | 前置条件 | 步骤 | 预期结果 |
|---------|------|----------|------|----------|
| NAV-001 | 导航栏在所有页面显示 | — | 遍历所有页面 | 导航栏一致 |
| NAV-002 | 移动端汉堡菜单 | viewport < 550px | 查看导航栏 | 显示汉堡按钮，点击展开菜单 |
| NAV-003 | 墨线分隔符正确渲染 | — | 查看首页 | "竹 ──── 墨线 ──── 竹" 格式 |
| NAV-004 | Footer 在所有页面显示 | — | 遍历所有页面 | Footer 一致 |
| NAV-005 | 页面间导航正常 | — | 点击各导航链接 | 正确跳转到对应页面 |

---

## 5. 性能测试

### 5.1 Lighthouse CI 目标

| 指标 | 目标分数 | 最低可接受分数 | 测试页面 |
|------|----------|---------------|----------|
| Performance | ≥ 90 | ≥ 85 | 首页、文章列表、文章详情 |
| Accessibility | ≥ 90 | ≥ 85 | 首页、文章详情 |
| Best Practices | ≥ 90 | ≥ 85 | 首页 |
| SEO | ≥ 90 | ≥ 85 | 文章详情页 |

### 5.2 Core Web Vitals 目标

| 指标 | 目标 | 测量方式 |
|------|------|----------|
| LCP | ≤ 2.5s | Lighthouse + Chrome DevTools |
| FID / INP | ≤ 200ms | Lighthouse |
| CLS | ≤ 0.1 | Lighthouse |
| TTFB | ≤ 800ms | WebPageTest / curl -w |

### 5.3 性能测试方法

**手动测试（每个 Sprint 结束后）**：

```bash
# 构建并启动生产模式
npm run build && npm start

# 使用 Chrome DevTools Lighthouse 面板测试
# 或使用 Lighthouse CLI：
npx lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html
npx lighthouse http://localhost:3000/articles --output=html --output-path=./lighthouse-articles.html
npx lighthouse http://localhost:3000/articles/hello-world --output=html --output-path=./lighthouse-article-detail.html
```

**自动化测试（CI 中集成，Sprint 5 后配置）**：

```yaml
# .github/workflows/lighthouse.yml（预留）
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npx @lhci/cli@0.13.x autorun
```

### 5.4 性能优化检查清单

| # | 检查项 | 验证方式 |
|---|--------|----------|
| P-01 | 字体使用 `font-display: swap` | 查看网络请求 |
| P-02 | 关键字体 preload | 查看 `<head>` 中的 `<link rel="preload">` |
| P-03 | 图片使用 `next/image` 或 `loading="lazy"` | 查看页面源码 |
| P-04 | 无未使用的 CSS | Chrome DevTools Coverage |
| P-05 | 无渲染阻塞 JS | Lighthouse 报告 |
| P-06 | 页面使用 SSG 预渲染 | `npm run build` 输出中确认 `.html` 文件 |
| P-07 | 首屏无 CLS | Lighthouse CLS 分数 ≤ 0.1 |
| P-08 | 第三方脚本不超过 2 个 | Chrome DevTools Network |

---

## 6. 兼容性测试

### 6.1 浏览器测试矩阵

| 浏览器 | 版本 | 优先级 | 测试方式 |
|--------|------|--------|----------|
| Chrome (macOS) | 最新 | P0 | 手动 + Playwright |
| Safari (macOS) | 最新 | P0 | 手动 |
| Firefox (macOS) | 最新 | P1 | Playwright |
| Chrome (Android) | 最新 | P0 | Playwright mobile 模拟 |
| Safari (iOS) | 最新 | P0 | Playwright mobile 模拟 |
| WeChat 内置浏览器 | — | P1 | 真机测试 |
| Edge (Windows) | 最新 | P2 | Playwright Chromium |

### 6.2 设备测试矩阵

| 设备类型 | 分辨率 | 优先级 | 测试方式 |
|----------|--------|--------|----------|
| 桌面 | 1440×900 | P0 | 手动测试 |
| 桌面 | 1920×1080 | P1 | 手动测试 |
| 平板 | 768×1024 (iPad) | P0 | Chrome DevTools 模拟 |
| 手机 | 375×667 (iPhone SE) | P0 | Playwright mobile |
| 手机 | 390×844 (iPhone 14) | P0 | Playwright mobile |
| 大屏 | 2560×1440 | P2 | 手动测试 |

### 6.3 兼容性重点检查项

| # | 检查项 | 关注浏览器 |
|---|--------|-----------|
| C-01 | CSS `backdrop-filter: blur()` 毛玻璃效果 | Firefox (需确认支持) |
| C-02 | CSS Custom Properties（CSS 变量） | 所有 (IE 除外，已不支持) |
| C-03 | `font-display: swap` | Safari |
| C-04 | `<dialog>` 或其他现代 HTML 元素 | 如使用需检查 |
| C-05 | `gap` in flexbox | 旧版 Safari |
| C-06 | 中文字体渲染一致性 | macOS vs Windows vs Android |
| C-07 | 触摸事件（移动端汉堡菜单） | iOS Safari + Android Chrome |

### 6.4 微信内置浏览器特殊处理

微信内置浏览器基于 Chromium 但有特殊限制：

- 不支持 `backdrop-filter` → 提供纯色背景 fallback
- 可能阻止外部字体加载 → 系统字体 fallback 链
- 分享行为特殊 → 不处理微信分享（MVP 阶段）

```css
/* Fallback 示例 */
.nav-backdrop {
  background: rgba(250, 250, 247, 0.95); /* 不支持 backdrop-filter 时的 fallback */
}

@supports (backdrop-filter: blur(10px)) {
  .nav-backdrop {
    background: rgba(250, 250, 247, 0.8);
    backdrop-filter: blur(10px);
  }
}
```

---

## 7. SEO 验证清单

### 7.1 每个页面必须验证

| # | 检查项 | 验证方式 | 通过标准 |
|---|--------|----------|----------|
| SEO-V01 | 页面有唯一的 `<title>` | 查看源码 | 每页 title 不同且有意义 |
| SEO-V02 | 页面有 `<meta name="description">` | 查看源码 | description ≤ 160 字符 |
| SEO-V03 | 页面有 `lang="zh-CN"` | 查看源码 | `<html lang="zh-CN">` |
| SEO-V04 | 页面有 canonical URL | 查看源码 | `<link rel="canonical">` 正确 |
| SEO-V05 | 页面有 OG tags | 查看源码 | og:title, og:description, og:type |
| SEO-V06 | 页面有 Twitter Card tags | 查看源码 | twitter:card, twitter:title |
| SEO-V07 | 内测期有 noindex | 查看源码 | `<meta name="robots" content="noindex, nofollow">` |

### 7.2 文章详情页额外验证

| # | 检查项 | 验证方式 | 通过标准 |
|---|--------|----------|----------|
| SEO-V08 | JSON-LD 结构化数据正确 | Google 富媒体测试工具 | 无错误，类型为 Article |
| SEO-V09 | JSON-LD 包含 headline | 查看源码 | headline 与文章标题一致 |
| SEO-V10 | JSON-LD 包含 datePublished | 查看源码 | 日期格式 ISO 8601 |
| SEO-V11 | JSON-LD 包含 author | 查看源码 | author.name 有值 |
| SEO-V12 | H1 标签唯一 | 查看源码 | 每页仅一个 `<h1>` |
| SEO-V13 | 标题层级正确 | 查看源码 | H1 → H2 → H3，不跳级 |

### 7.3 全站 SEO 验证

| # | 检查项 | 验证方式 | 通过标准 |
|---|--------|----------|----------|
| SEO-V14 | robots.txt 可访问 | `curl /robots.txt` | 返回正确内容 |
| SEO-V15 | sitemap.xml 可访问 | `curl /sitemap.xml` | 返回正确 XML |
| SEO-V16 | sitemap 包含所有已启用页面 | 人工核对 | 无遗漏、无已禁用页面 |
| SEO-V17 | 无死链接 | 手动点击所有内部链接 | 所有链接返回 200 |
| SEO-V18 | 图片有 alt 属性 | 查看源码 | 所有 `<img>` 有非空 alt |

### 7.4 SEO 验证工具

```bash
# 1. Google 富媒体测试工具
# 访问 https://search.google.com/test/rich-results
# 输入文章详情页 URL

# 2. 手动查看源码
curl -s https://xxx.vercel.app/articles/hello-world | grep -E '<title>|<meta|application/ld'

# 3. Open Graph 检查
# 访问 https://www.opengraph.xyz
# 输入文章详情页 URL

# 4. Twitter Card 检查
# 访问 https://cards-dev.twitter.com/validator
# 输入文章详情页 URL
```

---

## 8. 可访问性验证清单

### 8.1 WCAG 2.1 AA 合规检查

| # | 检查项 | WCAG 准则 | 验证方式 | 优先级 |
|---|--------|-----------|----------|--------|
| A11Y-01 | 所有图片有 alt 属性 | 1.1.1 非文本内容 | 查看源码 | P0 |
| A11Y-02 | 表单 input 有 label | 1.3.1 信息和关系 | 查看源码 | P0 |
| A11Y-03 | 颜色对比度 ≥ 4.5:1 | 1.4.3 对比度（最低） | Chrome DevTools / axe | P0 |
| A11Y-04 | 链接文字有意义 | 2.4.4 链接目的 | 人工审查 | P0 |
| A11Y-05 | 页面有唯一 H1 | 1.3.1 信息和关系 | 查看源码 | P0 |
| A11Y-06 | 可通过键盘导航 | 2.1.1 键盘可操作 | Tab 键遍历 | P0 |
| A11Y-07 | 焦点顺序合理 | 2.4.3 焦点顺序 | Tab 键遍历 | P1 |
| A11Y-08 | 焦点可见 | 2.4.7 焦点可见 | Tab 键遍历 | P1 |
| A11Y-09 | viewport 无 maximum-scale | 1.4.4 调整文字大小 | 查看 `<meta viewport>` | P0 |
| A11Y-10 | 页面语言正确 | 3.1.1 页面语言 | 查看 `<html lang>` | P0 |

### 8.2 组件级可访问性

| 组件 | 检查项 | 实现方式 |
|------|--------|----------|
| 导航栏 | `nav` 语义标签 + `aria-label` | `<nav aria-label="主导航">` |
| 汉堡菜单 | `aria-expanded` + `aria-controls` | 按钮控制展开/收起 |
| 文章卡片 | 语义化标题 + 链接文字 | 卡片整体可点击或标题为链接 |
| 订阅表单 | `label` 关联 `input` + `aria-describedby` | 错误信息关联到输入框 |
| 订阅表单 | 错误信息 `role="alert"` | 实时播报错误 |
| 墨线分隔符 | `role="separator"` 或 `<hr>` | 装饰性分隔符用 `aria-hidden="true"` |
| 占位页面 | 装饰性元素 `alt=""` 或 `aria-hidden` | 不影响屏幕阅读器 |
| 404/500 页面 | 有意义的标题和描述 | 屏幕阅读器可理解 |

### 8.3 可访问性测试工具

```bash
# 1. axe DevTools（浏览器扩展）
# 安装 axe DevTools Chrome 扩展
# 打开页面 → 运行扫描 → 查看报告

# 2. Lighthouse Accessibility 审计
npx lighthouse http://localhost:3000 --only-categories=accessibility --output=html

# 3. 键盘导航测试
# 手动：Tab / Shift+Tab / Enter / Escape 遍历所有交互元素

# 4. 屏幕阅读器测试
# macOS: VoiceOver (Cmd+F5)
# 测试流程：打开页面 → 用 VoiceOver 朗读内容 → 确认信息可理解

# 5. 颜色对比度检查
# Chrome DevTools → Elements → Color 对比度指示器
# 或使用 WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
```

### 8.4 SOLO.X 设计配色的对比度检查

根据 PRD §3.1 的配色方案，需验证以下组合：

| 组合 | 前景色 | 背景色 | 预期对比度 | 是否达标 |
|------|--------|--------|-----------|---------|
| 正文文字 | `#1e1e1e` (char) | `#fafaf7` (white) | ~16:1 | AA 通过 |
| 二级文字 | `#3a3a3a` (char2) | `#fafaf7` (white) | ~10:1 | AA 通过 |
| 辅助文字 | `#666` (char3) | `#fafaf7` (white) | ~5.7:1 | AA 通过 |
| CTA 按钮 | `#fafaf7` (white) | `#5a7a54` (sage2) | ~5.5:1 | AA 通过 |
| 链接文字 | `#5a7a54` (sage2) | `#fafaf7` (white) | ~5.5:1 | AA 通过 |
| 卡片文字 | `#1e1e1e` (char) | `#f2f0ea` (off) | ~14:1 | AA 通过 |
| 付费标签 | `#c4842a` (accent) | `#f2f0ea` (off) | ~3.5:1 | 需加粗或调深 |

> 注意：金色强调 `#c4842a` 在浅色背景上对比度可能不足 4.5:1。建议使用时加粗（font-weight: 700）或调深至 `#a06d1f`。

---

## 9. 测试执行计划

### 9.1 每个 Sprint 的测试节奏

```
Sprint 开始
  ↓
编码阶段：边写代码边写单元测试（TDD 鼓励但不强制）
  ↓
Sprint 中期：补充集成测试
  ↓
Sprint 结束前：运行完整测试套件
  ↓
Sprint 验收：手动验收 + E2E 测试
  ↓
Sprint 回顾：记录测试中发现的缺陷和改进点
```

### 9.2 测试命令

```bash
# 运行所有测试
npm run test

# 仅运行单元测试
npm run test -- __tests__/unit/

# 仅运行集成测试
npm run test -- __tests__/integration/

# 运行 E2E 测试（需先启动 dev server）
npx playwright test

# 运行测试并生成覆盖率报告
npm run test -- --coverage

# 监听模式（开发时使用）
npm run test -- --watch
```

### 9.3 package.json scripts 补充

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "typecheck": "tsc --noEmit"
  }
}
```

### 9.4 覆盖率目标

| 模块 | 行覆盖率目标 | 分支覆盖率目标 |
|------|-------------|---------------|
| `lib/articles.ts` | ≥ 90% | ≥ 80% |
| `lib/subscribe.ts` | ≥ 85% | ≥ 75% |
| `lib/features.ts` | ≥ 90% | ≥ 85% |
| `lib/constants.ts` | ≥ 80% | — |
| `components/*.tsx` | ≥ 70% | ≥ 60% |
| 整体 | ≥ 80% | ≥ 70% |

---

## 10. 缺陷管理

### 10.1 缺陷分级

| 等级 | 定义 | 示例 | 修复时效 |
|------|------|------|----------|
| P0 - 阻塞 | 核心功能不可用 | 文章无法渲染、订阅无法提交、构建失败 | 立即修复 |
| P1 - 严重 | 功能受影响但有变通方案 | 筛选不工作但可直接浏览 | 当前 Sprint 内 |
| P2 - 一般 | 非核心功能异常 | 样式偏移、动画不流畅 | 下一 Sprint |
| P3 - 轻微 | 视觉或体验小问题 | 标签对齐不完美 | 可排入 backlog |

### 10.2 测试产出物

每个 Sprint 完成后产出：

1. **测试执行报告**：通过/失败用例数、覆盖率数据
2. **缺陷清单**：发现的问题及修复状态
3. **Lighthouse 报告**：性能/可访问性/SEO 分数
4. **兼容性检查表**：已验证的浏览器和设备
