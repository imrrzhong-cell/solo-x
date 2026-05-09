# SOLO.X 管理文档

## 如何创建新文章

1. 在 `content/articles/` 目录下创建 `.mdx` 文件
2. 文件名即为 URL slug（如 `my-article.mdx` → `/articles/my-article`）
3. 文件开头必须包含 frontmatter：

```markdown
---
title: "文章标题"
date: "2026-05-09"
type: "essay"
tags: ["标签1", "标签2"]
excerpt: "文章摘要，150字以内"
draft: false
---

正文内容...
```

4. `type` 可选值：`essay`、`note`、`tool`、`smidgeon`、`now`
5. `draft: true` 的文章不会显示在列表页
6. 推送到 GitHub 后 Vercel 会自动部署

## 如何修改页面样式

所有样式在 `app/globals.css` 中，通过 CSS Variables 控制：

- `--white` / `--off` / `--warm` — 背景色系
- `--sage` / `--sage2` / `--sage3` — 竹绿色系（强调色）
- `--char` / `--char2` / `--char3` — 文字色系
- `--accent` / `--accent-light` — 金色系

修改对应变量值即可全局生效。

## 如何开启某个功能

1. 修改 `.env.local` 中对应的环境变量为 `true`
2. Vercel 部署时在 Dashboard → Settings → Environment Variables 中同步修改
3. 可用的功能开关：

| 变量 | 作用 |
|------|------|
| `NEXT_PUBLIC_FEATURE_ARTICLES` | 文章系统 |
| `NEXT_PUBLIC_FEATURE_MUSIC` | 原创音乐 |
| `NEXT_PUBLIC_FEATURE_COURSES` | 视频课程 |
| `NEXT_PUBLIC_FEATURE_APPS` | 微信小程序 |
| `NEXT_PUBLIC_FEATURE_WEBAPPS` | 网页应用 |
| `NEXT_PUBLIC_FEATURE_GAMES` | 创意游戏 |
| `NEXT_PUBLIC_FEATURE_TOOLS` | OPC 工具箱 |
| `NEXT_PUBLIC_FEATURE_PRICING` | 定价页 |
| `NEXT_PUBLIC_FEATURE_MEMBERS` | 会员系统 |

## 如何部署更新

```bash
git add .
git commit -m "描述你的修改"
git push
```

推送后 Vercel 会自动检测并部署。可在 Vercel Dashboard 查看部署状态。

## 首次部署步骤

1. 在 GitHub 创建仓库并推送代码
2. 登录 Vercel → Import Project → 选择仓库
3. Framework 自动检测为 Next.js
4. 在 Environment Variables 中添加所有变量（参考 `.env.example`）
5. 点击 Deploy

## 常见问题

### 构建失败

- 检查 MDX 文件的 frontmatter 格式是否正确
- 运行 `npm run build` 本地复现
- 检查环境变量是否完整

### 环境变量缺失

- 复制 `.env.example` 为 `.env.local`
- 填入真实值（Resend API Key 等）
- Vercel 部署时在 Settings 中同步配置

### 文章不显示

- 检查 `draft` 是否为 `true`
- 检查 frontmatter 的 `date` 格式是否为 `YYYY-MM-DD`
- 检查 `type` 是否为合法枚举值
