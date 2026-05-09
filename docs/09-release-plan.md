# SOLO.X — 发布与灰度计划

> 版本：v1.0 | 更新：2026-05-09
> 定位：一人公司创作平台 · 个人品牌网站
> 阶段：MVP 内测期
> 部署：Next.js 16 + Vercel（默认域名）

---

## 1. 环境策略

### 1.1 三套环境

| 环境 | URL | 用途 | 数据 |
|------|-----|------|------|
| 开发环境 | `localhost:3000` | 本地开发与调试 | 本地 mock 数据 |
| Preview 环境 | `*.vercel.app`（PR 自动生成） | PR 预览、团队/内测评审 | 生产同等数据 |
| 生产环境 | `solo-x.vercel.app`（Vercel 默认域名） | 对外正式服务 | 真实用户数据 |

### 1.2 环境配置原则

- 所有环境共享同一套代码，通过环境变量区分行为
- Preview 环境与生产环境使用相同的构建配置
- 本地开发通过 `.env.local` 覆盖，不提交至仓库
- Vercel 环境变量分为三组独立配置：Development / Preview / Production

---

## 2. 分支策略

### 2.1 分支模型

```
main ───────────────────────────────────── 生产分支（受保护）
  │
  └─ develop ──────────────────────────── 开发集成分支
       │
       ├─ feature/articles-hero ──────── 功能分支
       ├─ feature/subscribe-form
       ├─ feature/zen-design-system
       ├─ fix/mobile-nav-bug ─────────── 修复分支
       └─ ...
```

| 分支 | 命名规则 | 生命周期 | 合并目标 |
|------|----------|----------|----------|
| `main` | — | 永久 | 自动触发 Vercel Production 部署 |
| `develop` | — | 永久 | 定期合并至 `main` |
| `feature/*` | `feature/模块名-简述` | 功能完成后删除 | 合并至 `develop` |
| `fix/*` | `fix/简述` | 修复完成后删除 | 合并至 `develop` |
| `hotfix/*` | `hotfix/简述` | 紧急修复后删除 | 直接合并至 `main` + `develop` |

### 2.2 分支保护规则

**main 分支**：
- 禁止直接 push
- 必须通过 Pull Request 合并
- 至少 1 人 approve（一人团队即自己 review）
- PR 必须通过 CI 检查（构建成功 + Lint 通过）
- 合并方式：Squash Merge（保持 main 历史整洁）

**develop 分支**：
- 禁止直接 push
- 必须通过 Pull Request 合并
- 合并方式：Merge Commit（保留功能分支历史）

### 2.3 提交规范

```
<type>(<scope>): <subject>

type: feat | fix | docs | style | refactor | perf | test | chore
scope: articles | nav | subscribe | design | deploy | ...
```

示例：
```
feat(articles): 添加文章列表页筛选功能
fix(nav): 修复移动端汉堡菜单点击穿透
chore(deploy): 配置 Vercel 环境变量
```

---

## 3. 发布流程

### 3.1 标准发布流程

```
1. 从 develop 创建 feature 分支
      │
2. 本地开发 + 自测（localhost:3000）
      │
3. 推送 feature 分支 → 创建 PR 到 develop
      │
4. Vercel 自动生成 Preview 部署
      │
5. Preview 环境验证
      │
6. 代码审查 + CI 通过 → 合并到 develop
      │
7. develop 积累一定功能后 → 创建 PR 到 main
      │
8. 最终 Preview 验证 → 合并 main
      │
9. Vercel 自动部署至 Production
      │
10. 生产环境冒烟测试
```

### 3.2 紧急修复流程

```
1. 从 main 创建 hotfix/* 分支
      │
2. 修复 + 本地验证
      │
3. PR → main（跳过 develop）
      │
4. 自动部署 Production
      │
5. 同步合并回 develop
```

### 3.3 发布检查清单

每次合并到 `main` 前，逐项确认：

| # | 检查项 | 标准 | 工具 |
|---|--------|------|------|
| 1 | 代码审查 | 已 self-review，无遗留 TODO | GitHub PR |
| 2 | 构建通过 | `next build` 零错误零警告 | Vercel CI |
| 3 | Lint 通过 | ESLint 无 error | Vercel CI |
| 4 | 类型检查 | TypeScript 无 error | `tsc --noEmit` |
| 5 | 死链检查 | 页面路由均可访问 | 手动 / Lighthouse |
| 6 | 移动端适配 | 关键页面在 375px / 768px / 1440px 正常 | Preview 验证 |
| 7 | Lighthouse 分数 | Performance > 90, A11y > 85, SEO > 90, BP > 90 | Chrome DevTools |
| 8 | 功能开关 | 新功能对应的 `NEXT_PUBLIC_FEATURE_*` 已正确设置 | Vercel 环境变量 |
| 9 | 环境变量 | 新增的环境变量已在 Vercel 三套环境中配置 | Vercel Dashboard |
| 10 | 内容检查 | 新增 MDX 文章 front matter 格式正确、无草稿泄露 | 手动 |

---

## 4. 灰度发布策略

### 4.1 四阶段灰度路线

```
阶段一（当前）          阶段二              阶段三              阶段四
内测期         →    定向邀请        →    公测           →    正式发布
noindex             Preview 分享         开放访问            自定义域名
自我验证            少量真实用户         收集反馈            全量推广
```

### 4.2 阶段一：内测期（当前）

**时间**：MVP 开发期间

**目标**：完成核心功能开发，自我验证技术可行性

**措施**：
- `robots.txt` 禁止所有搜索引擎抓取
- 所有页面 `<meta name="robots" content="noindex, nofollow">`
- 仅通过 localhost 和 Vercel Preview 链接访问
- 不对外宣传，不分享链接

**robots.txt 配置**：
```
User-agent: *
Disallow: /
```

**进入标准**：项目初始化完成
**退出标准**：
- [ ] MVP 全部功能开发完成
- [ ] 发布检查清单全部通过
- [ ] Lighthouse 四项指标均达标
- [ ] 至少 3 篇初始文章已发布
- [ ] 订阅表单可用

### 4.3 阶段二：定向邀请

**时间**：MVP 完成后 1-2 周

**目标**：邀请 5-10 位目标用户试用，收集真实反馈

**措施**：
- 通过 Vercel Preview 链接分享给特定用户
- 仍然保持 noindex，搜索引擎不可见
- 收集反馈渠道：直接沟通 / 微信群
- 重点验证：内容可读性、导航体验、订阅流程

**进入标准**：阶段一退出标准全部满足
**退出标准**：
- [ ] 至少 5 位用户完成完整浏览路径
- [ ] 收集到 >= 10 条有效反馈
- [ ] 关键体验问题（如有）已修复
- [ ] 订阅表单至少收到 3 个真实邮箱

### 4.4 阶段三：公测

**时间**：定向邀请后 2-4 周

**目标**：开放公开访问，扩大用户基数，验证系统稳定性

**措施**：
- 移除 noindex meta 标签
- `robots.txt` 切换为允许抓取（保留管理路径禁止）
- 通过社交媒体、朋友圈、技术社区公开分享链接
- 仍使用 Vercel 默认域名
- 启用 Vercel Analytics 收集真实性能数据

**robots.txt 配置（公测版）**：
```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://solo-x.vercel.app/sitemap.xml
```

**进入标准**：
- [ ] 阶段二退出标准全部满足
- [ ] 至少 1 篇高质量文章作为种子内容
- [ ] 隐私政策和使用条款已完善

**退出标准**：
- [ ] 累计访问 >= 500 UV
- [ ] 订阅数 >= 50
- [ ] 连续 7 天无 P0 级错误
- [ ] 用户反馈满意度 > 80%
- [ ] SEO 索引开始生效（Google / Bing 收录）

### 4.5 阶段四：正式发布

**时间**：公测稳定后

**目标**：全量推广，建立专业品牌形象

**措施**：
- 绑定自定义域名（如 `solox.cc` / `solo-x.com`）
- 全量 SEO 优化（sitemap、structured data、OG image）
- 启动内容营销计划
- 启用 Plausible Analytics（$9/月）
- 集成 Sentry 错误监控
- 集成 Waline 评论系统

**进入标准**：
- [ ] 阶段三退出标准全部满足
- [ ] 自定义域名已购买并备案（如需）
- [ ] 至少 5 篇高质量文章
- [ ] 监控体系已部署

**退出标准**：
- [ ] 自定义域名生效且 HTTPS 配置完成
- [ ] 搜索引擎收录正常
- [ ] 各项监控指标正常

### 4.6 阶段切换操作清单

从阶段一切换到阶段二：
1. 确认阶段一退出标准
2. 准备内测邀请文案
3. 筛选邀请名单
4. 通过私信/微信群发送 Vercel Preview 链接

从阶段二切换到阶段三：
1. 修复定向邀请期间收集的问题
2. 修改 `robots.txt` 为允许抓取
3. 移除页面中的 noindex meta 标签
4. 生成并提交 sitemap.xml
5. 在 Vercel 启用 Analytics
6. 公开分享网站链接

从阶段三切换到阶段四：
1. 购买自定义域名
2. 在 Vercel 绑定域名 + 配置 DNS
3. 启用 Plausible Analytics
4. 集成 Sentry
5. 集成 Waline 评论
6. 更新所有硬编码的 URL
7. 提交新域名到 Google Search Console / Bing Webmaster

---

## 5. 功能灰度

### 5.1 功能开关体系

通过环境变量控制功能模块的显隐，实现功能的独立上线和灰度切换：

| 环境变量 | 控制模块 | MVP 默认值 | 公测值 | 正式值 |
|----------|----------|-----------|--------|--------|
| `NEXT_PUBLIC_FEATURE_ARTICLES` | 深度文章 | `true` | `true` | `true` |
| `NEXT_PUBLIC_FEATURE_MUSIC` | 原创音乐 | `false` | `false` | 按需 |
| `NEXT_PUBLIC_FEATURE_COURSES` | 视频课程 | `false` | `false` | 按需 |
| `NEXT_PUBLIC_FEATURE_APPS` | 微信小程序 | `false` | `false` | 按需 |
| `NEXT_PUBLIC_FEATURE_WEBAPPS` | 网页应用 | `false` | `false` | 按需 |
| `NEXT_PUBLIC_FEATURE_GAMES` | 创意游戏 | `false` | `false` | 按需 |
| `NEXT_PUBLIC_FEATURE_TOOLS` | OPC 工具箱 | `false` | `false` | 按需 |
| `NEXT_PUBLIC_FEATURE_PRICING` | 会员定价 | `false` | `true` | `true` |
| `NEXT_PUBLIC_FEATURE_MEMBERS` | 会员系统 | `false` | `false` | 按需 |
| `NEXT_PUBLIC_FEATURE_SEARCH` | 站内搜索 | `false` | `true` | `true` |
| `NEXT_PUBLIC_FEATURE_COMMENTS` | 评论系统 | `false` | `false` | `true` |
| `NEXT_PUBLIC_FEATURE_ANALYTICS` | 分析追踪 | `false` | `true` | `true` |

### 5.2 Vercel 环境变量配置方案

```
Vercel Project → Settings → Environment Variables

三套环境独立配置：
├── Production   → 正式用户看到的版本
├── Preview      → PR 预览版本（可与 Production 不同）
└── Development  → 本地 `vercel dev` 使用
```

**操作流程**：
1. 在 Vercel Dashboard → Settings → Environment Variables 中配置
2. 勾选目标环境（Production / Preview / Development）
3. 重新部署生效（Push 新 commit 或 Vercel Dashboard 手动 Redeploy）

### 5.3 功能开启流程

```
1. 确认功能开发完成且测试通过
      │
2. 在 Vercel Preview 环境开启功能开关
      │
3. 通过 Preview 链接验证功能表现
      │
4. 确认无问题 → 在 Vercel Production 环境开启开关
      │
5. 触发重新部署（或等待下次发布一同生效）
      │
6. 生产环境冒烟测试
      │
7. 监控错误率和用户反馈
```

### 5.4 功能开关代码模式

```tsx
// 使用示例：导航栏中控制模块显隐
const features = {
  articles: process.env.NEXT_PUBLIC_FEATURE_ARTICLES === 'true',
  music: process.env.NEXT_PUBLIC_FEATURE_MUSIC === 'true',
  courses: process.env.NEXT_PUBLIC_FEATURE_COURSES === 'true',
  // ...
};

// 导航菜单过滤
const navItems = [
  { label: '创作', href: '/articles', enabled: features.articles },
  { label: '音乐', href: '/music', enabled: features.music },
  { label: '课程', href: '/courses', enabled: features.courses },
].filter(item => item.enabled);
```

> 注意：`NEXT_PUBLIC_*` 变量在构建时注入，修改后需要重新构建才能生效。这是 Next.js 的设计，非运行时切换。如需运行时切换，可考虑通过 API Route 读取配置，但 MVP 阶段构建时注入足够。

---

## 6. 回滚方案

### 6.1 Vercel Instant Rollback（首选）

Vercel 保留每次 Production 部署记录，支持一键回滚：

**操作步骤**：
1. 登录 Vercel Dashboard → 选择项目
2. 进入 Deployments 页面
3. 找到上一个正常版本的部署记录
4. 点击右侧 `...` → `Promote to Production`
5. 确认回滚

**适用场景**：
- 部署后立即发现线上问题
- 功能异常但代码层面无破坏性变更
- 需要在几分钟内恢复服务

**耗时**：< 1 分钟（无需重新构建，直接切换流量）

### 6.2 Git Revert 流程

当需要永久性撤销某次变更时：

```
1. 确认问题引入的 commit hash
      │
2. git revert <commit-hash>
      │
3. 本地验证 revert 后代码正常
      │
4. 推送到 main → Vercel 自动部署
      │
5. 在 Deployments 页面确认新部署成功
```

**适用场景**：
- 合并了有问题的 PR，需要彻底移除代码
- Instant Rollback 后仍需修复代码层面问题
- 需要保持 git 历史的完整性

**耗时**：5-15 分钟（包含构建时间）

### 6.3 回滚决策矩阵

| 问题严重程度 | 影响范围 | 推荐方案 | 预期恢复时间 |
|-------------|----------|----------|-------------|
| 页面样式偏移 | 单个页面 | Instant Rollback | < 1 分钟 |
| 功能不可用 | 单个模块 | Instant Rollback + hotfix | < 30 分钟 |
| 构建失败 | 全站 | 修复代码 + 重新部署 | 5-15 分钟 |
| 数据损坏 | 数据层面 | 评估影响后决定 | 视情况而定 |

### 6.4 数据回滚

本项目 MVP 阶段数据主要包含：
- MDX 文章文件（Git 版本控制，可随时 revert）
- 邮箱订阅数据（Resend 平台管理，通过 Resend Dashboard 处理）

如后续引入数据库（会员系统等），需额外制定数据库备份与回滚方案。

---

## 7. 监控与告警

### 7.1 监控体系总览

| 监控维度 | 工具 | 启用阶段 | 成本 |
|----------|------|----------|------|
| 性能分析 | Vercel Analytics | 公测期 | 免费（Hobby） |
| 真实用户监控 | Vercel Speed Insights | 公测期 | 免费（Hobby） |
| 错误监控 | Sentry | 正式发布 | 免费额度（5K 错误/月） |
| 正常运行时间 | Vercel 状态页 | 内测期 | 免费 |
| SEO 监控 | Google Search Console | 公测期 | 免费 |

### 7.2 Vercel Analytics

**启用方式**：
```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**监控指标**：
- Web Vitals（LCP / FID / CLS / TTFB）
- 页面访问量
- 访问来源

### 7.3 Sentry 错误监控（预留）

**计划启用时机**：正式发布阶段

**集成方案**：
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**配置要点**：
- `sentry.client.config.ts` — 客户端错误捕获
- `sentry.server.config.ts` — 服务端错误捕获
- `next.config.ts` — Sentry Webpack 插件 + Source Map 上传
- 环境变量：`SENTRY_DSN`、`SENTRY_AUTH_TOKEN`

**告警规则**（正式启用后配置）：
- 错误率 > 1% → 邮件通知
- 单个错误 5 分钟内触发 > 10 次 → 即时通知

### 7.4 正常运行时间监控

**方案 A**：Vercel 内置状态页
- 访问 `vercel.com/status` 查看 Vercel 平台状态
- Vercel 自动监控部署健康状态

**方案 B**（推荐，公测期启用）：UptimeRobot 免费版
- 每 5 分钟检测一次网站可用性
- 免费额度：50 个监控
- 告警方式：邮件 / webhook

### 7.5 SEO 监控

**公测期启用**：
- Google Search Console：提交 sitemap，监控索引量和搜索表现
- Bing Webmaster Tools：提交 sitemap，监控 Bing 收录

---

## 8. 发布日历

### 8.1 MVP 内测期（当前 ~ 第 4 周）

| 周次 | 重点任务 | 交付物 |
|------|----------|--------|
| 第 1 周 | 项目初始化 + 设计系统 + 首页 | 项目骨架、全局 CSS、首页完整 |
| 第 2 周 | 文章系统 + 关于页 | 文章列表页、详情页、关于页 |
| 第 3 周 | 占位页面 + 订阅表单 + 法律页面 | 6 个占位页、订阅功能、隐私/条款 |
| 第 4 周 | 集成测试 + 性能优化 + 内测准备 | Lighthouse 达标、发布检查通过 |

### 8.2 功能模块上线计划

| 阶段 | 模块 | 优先级 | 预计时间 | 前置条件 |
|------|------|--------|----------|----------|
| MVP | 深度文章 + 关于页 + 订阅 | P0 | 第 1-4 周 | — |
| V1.1 | 站内搜索（Pagefind） | P1 | 第 5-6 周 | 文章 >= 10 篇 |
| V1.2 | 分析工具（Plausible） | P1 | 第 6 周 | 公测开启 |
| V1.3 | 评论系统（Waline） | P2 | 第 7-8 周 | 公测稳定 |
| V2.0 | OPC 工具箱 | P1 | 第 9-12 周 | 搜索/评论就绪 |
| V2.1 | 原创音乐模块 | P2 | 第 13-14 周 | 有音乐内容 |
| V2.2 | 视频课程模块 | P2 | 第 15-16 周 | 有课程内容 |
| V3.0 | 会员系统（登录 + 支付） | P1 | 第 17-20 周 | 多模块上线、内容充足 |
| V3.1 | 网页应用模块 | P2 | 按需 | 有应用产品 |
| V3.2 | 创意游戏模块 | P3 | 按需 | 有游戏产品 |
| V3.3 | 微信小程序模块 | P3 | 按需 | 有小程序产品 |

### 8.3 关键里程碑

| 里程碑 | 目标日期 | 标志事件 |
|--------|----------|----------|
| MVP 完成 | 第 4 周末 | 全部发布检查通过，进入定向邀请 |
| 公测开启 | 第 6 周 | 移除 noindex，公开分享 |
| 正式发布 | 第 8-10 周 | 绑定自定义域名，全量推广 |
| 内容生态成型 | 第 16 周 | >= 6 个模块上线，>= 30 篇文章 |

---

## 附录：Vercel 部署配置备忘

### 环境变量清单

```env
# 功能开关（Production 值）
NEXT_PUBLIC_FEATURE_ARTICLES=true
NEXT_PUBLIC_FEATURE_MUSIC=false
NEXT_PUBLIC_FEATURE_COURSES=false
NEXT_PUBLIC_FEATURE_APPS=false
NEXT_PUBLIC_FEATURE_WEBAPPS=false
NEXT_PUBLIC_FEATURE_GAMES=false
NEXT_PUBLIC_FEATURE_TOOLS=false
NEXT_PUBLIC_FEATURE_PRICING=false
NEXT_PUBLIC_FEATURE_MEMBERS=false
NEXT_PUBLIC_FEATURE_SEARCH=false
NEXT_PUBLIC_FEATURE_COMMENTS=false
NEXT_PUBLIC_FEATURE_ANALYTICS=false

# 服务端密钥（不暴露客户端）
RESEND_API_KEY=re_xxxxxxxx

# SEO 控制（内测期）
NEXT_PUBLIC_NOINDEX=true

# Sentry（正式发布后配置）
# SENTRY_DSN=https://xxx@sentry.io/xxx
# SENTRY_AUTH_TOKEN=xxxxxxx
```

### Vercel 项目设置

```
Framework Preset:    Next.js
Build Command:       next build
Output Directory:    .next
Install Command:     npm install
Node.js Version:     20.x
```
