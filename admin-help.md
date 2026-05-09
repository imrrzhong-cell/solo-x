# SOLO.X 操作手册

> 这份手册覆盖你日常会用到的所有操作。
> 所有修改都是「改代码 → git push → 自动上线」的流程。

---

## 一、发表新文章

### 步骤

1. 在项目目录下找到 `content/articles/` 文件夹
2. 新建一个 `.mdx` 文件（文件名用英文小写+短横线，比如 `my-new-post.mdx`）
3. 文件名 = 网址路径（`my-new-post.mdx` → 网址 `/articles/my-new-post`）
4. 文件内容按下面模板写：

```
---
title: "你的文章标题"
date: "2026-05-10"
type: "essay"
tags: ["标签1", "标签2"]
excerpt: "一句话摘要，150字以内，会显示在文章列表中"
draft: false
---

## 正文从这里开始

这里写文章内容，支持普通 Markdown 语法：

- **加粗**、*斜体*
- 列表
- [链接](https://example.com)
- 代码块（三个反引号）

### 二级标题

正文内容...

#### 三级标题

更多内容...
```

5. 保存后，提交推送：

```bash
git add content/articles/my-new-post.mdx
git commit -m "发布新文章：你的标题"
git push
```

推送后约 1 分钟自动上线。

### 文章类型（type 字段）

| 值 | 含义 | 适用场景 |
|---|---|---|
| `essay` | 深度文章 | 长篇思考、方法论 |
| `note` | 短笔记 | 快速分享、灵感记录 |
| `tool` | 工具推荐 | 工具介绍、使用体验 |
| `smidgeon` | 碎片 | 一句话、一段摘录 |
| `now` | 近况更新 | 当下在做什么 |

### 常用操作

**暂不发布（草稿）**：把 `draft: false` 改成 `draft: true`，文章不会出现在列表中

**删除文章**：删除对应的 `.mdx` 文件，然后 git push

**修改文章**：直接编辑 `.mdx` 文件，git push

---

## 二、开放板块（功能开关）

每个板块通过环境变量控制开关。打开/关闭分两步：

### 第一步：本地改 `.env.local`

打开项目根目录的 `.env.local` 文件，找到要开的板块，把 `false` 改成 `true`：

```
NEXT_PUBLIC_FEATURE_MUSIC=true    # 改这一行
```

### 第二步：Vercel 网页改环境变量

1. 打开 https://vercel.com/dashboard
2. 点进 `solo-x` 项目
3. 点顶部 **Settings** 标签
4. 左侧点 **Environment Variables**
5. 找到对应的变量（如 `NEXT_PUBLIC_FEATURE_MUSIC`），点击编辑，值改成 `true`
6. 保存

### 第三步：触发部署

改完 Vercel 环境变量后需要重新部署：
- 在 Vercel 的 **Deployments** 标签页，点最新一条右侧的 `...` → **Redeploy**

或者在终端执行：
```bash
git commit --allow-empty -m "开启音乐板块"
git push
```

### 所有板块开关

| 变量名 | 对应板块 | 当前状态 |
|---|---|---|
| `NEXT_PUBLIC_FEATURE_ARTICLES` | 深度文章 | ✅ 已开启 |
| `NEXT_PUBLIC_FEATURE_MUSIC` | 原创音乐 | ❌ 未开启 |
| `NEXT_PUBLIC_FEATURE_COURSES` | 视频课程 | ❌ 未开启 |
| `NEXT_PUBLIC_FEATURE_APPS` | 微信小程序 | ❌ 未开启 |
| `NEXT_PUBLIC_FEATURE_WEBAPPS` | 网页应用 | ❌ 未开启 |
| `NEXT_PUBLIC_FEATURE_GAMES` | 创意游戏 | ❌ 未开启 |
| `NEXT_PUBLIC_FEATURE_TOOLS` | OPC 工具箱 | ❌ 未开启 |
| `NEXT_PUBLIC_FEATURE_PRICING` | 会员定价 | ❌ 未开启 |
| `NEXT_PUBLIC_FEATURE_MEMBERS` | 会员系统 | ❌ 未开启 |

开启后的效果：
- **首页**：对应卡片从"即将推出"变为正常显示
- **导航栏**：对应菜单项自动出现
- **占位页**：已有对应页面（如 `/music`、`/courses` 等），开启后内容不变化

---

## 三、修改页面内容

### 首页

文件：`app/page.tsx`

可修改的区域：
- **Hero 标语**：搜索 `独行者` `创造的` `无限可能`，修改文字
- **Hero 诗句**：搜索 `文字之间，有光`，修改文字
- **数据卡片**（240+/18/5K+）：搜索 `ZenCard`，修改数字和描述
- **六模块卡片**：搜索 `CONTENT_ITEMS`，修改每个模块的描述、数量等
- **OPC 工具箱**：搜索 `tl-item`，增删工具卡片
- **定价卡片**：搜索 `pc-card`，修改价格、功能列表

### 关于页

文件：`app/about/page.tsx`

可修改：个人简介文字、技能标签、社交链接

社交链接在 `lib/constants.ts` 的 `SOCIAL_LINKS` 中修改。

### 导航栏

文件：`components/nav.tsx`

菜单项由 `lib/constants.ts` 的 `NAV_LINKS` 控制，配合功能开关自动显隐。

### 页脚

文件：`components/footer.tsx`

可修改品牌名、版权文字。

### 隐私政策 / 使用条款

文件：`app/privacy/page.tsx` 和 `app/terms/page.tsx`

直接编辑文字内容即可。

### 占位页面（音乐/课程/小程序/网页应用/游戏/工具/联系）

文件：`app/music/page.tsx`、`app/courses/page.tsx` 等

每个占位页只有 3 行，修改 title/number/description 即可。

---

## 四、调整版式和样式

### 全局配色

文件：`app/globals.css`，开头 `:root` 部分

```css
:root{
  --white:#fafaf7;    /* 主背景 */
  --off:#f2f0ea;      /* 次背景 */
  --warm:#e8e4d9;     /* 卡片悬停 */
  --sage:#7d9b76;     /* 竹绿-浅 */
  --sage2:#5a7a54;    /* 竹绿-中（按钮、强调） */
  --sage3:#3d5939;    /* 竹绿-深 */
  --char:#1e1e1e;     /* 主文字 */
  --char2:#3a3a3a;    /* 次文字 */
  --char3:#666;       /* 辅助文字 */
  --accent:#c4842a;   /* 金色（付费标记） */
}
```

改颜色只需改这些变量值，全站自动生效。

### 字体大小

在 `globals.css` 中搜索对应类名：
- `.hero-title` → 首页大标题
- `.sec-title` → 板块标题
- `.article-detail h1` → 文章详情标题
- `body` → 全局正文字号

### 间距

搜索 `padding`、`margin`、`gap` 调整。主要区域间距：
- `.section` → 板块区域的上下间距
- `.hero` → 首屏高度和间距
- `.article-detail` → 文章详情页间距

### 响应式

文件底部有两个断点：
- `@media(max-width:900px)` → 平板适配
- `@media(max-width:550px)` → 手机适配

---

## 五、管理订阅

### 查看订阅者

1. 打开 https://resend.com/audiences
2. 点进 `SOLO.X Subscribers` 受众
3. 可以看到所有订阅者邮箱

### 订阅功能说明

- 用户在首页或文章底部填写邮箱 → 数据存到 Resend
- 订阅表单有基本校验（邮箱格式 + 同意隐私政策）
- 同一邮箱重复提交不会报错
- 环境变量 `RESEND_API_KEY` 和 `RESEND_AUDIENCE_ID` 控制此功能

---

## 六、完整发布流程（从改代码到上线）

```bash
# 1. 本地修改文件（用任何编辑器都行）
# 2. 查看改了什么
git status

# 3. 暂存所有修改
git add .

# 4. 提交（引号里写简短描述）
git commit -m "发布新文章：XXX"

# 5. 推送到 GitHub，自动触发 Vercel 部署
git push
```

大约 1 分钟后，修改就会出现在 https://solo-x-wheat.vercel.app

---

## 七、常用链接汇总

| 用途 | 地址 |
|---|---|
| 线上网站 | https://solo-x-wheat.vercel.app |
| GitHub 仓库 | https://github.com/imrrzhong-cell/solo-x |
| Vercel 控制台 | https://vercel.com/dashboard |
| Resend 控制台 | https://resend.com/dashboard |
| Vercel 环境变量 | https://vercel.com → solo-x → Settings → Environment Variables |

---

## 八、找 Claude 帮忙

当你需要做以上任何操作但不确定怎么做时，直接告诉 Claude 你想做什么，例如：

- "帮我写一篇关于 XXX 的文章"
- "帮我开启音乐板块"
- "帮我把首页标语改成 XXX"
- "帮我把竹绿色调深一点"
- "帮我修改关于页的个人简介"
- "网站打不开了，帮我看看"

Claude 会直接帮你改代码并推送上线。
