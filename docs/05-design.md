# 05 - 高保真设计规范

> 基于 demo-6-zen.html 提取的完整设计系统
> 风格：禅意竹影（Zen Bamboo）
> 最后更新：2025-05-09

---

## 1. 配色系统

### 1.1 CSS Variables 完整定义

```css
:root {
  --white:      #fafaf7;   /* 页面底色，温暖白 */
  --off:        #f2f0ea;   /* 卡片默认背景，米白 */
  --warm:       #e8e4d9;   /* 卡片 hover 背景，暖灰 */
  --warm2:      #d8d2c2;   /* 序号颜色，浅棕 */
  --sage:       #7d9b76;   /* 品牌主色，竹绿 */
  --sage2:      #5a7a54;   /* 品牌强调色，深竹绿 */
  --sage3:      #3d5939;   /* 品牌最深色，暗竹绿 */
  --char:       #1e1e1e;   /* 标题文字，炭黑 */
  --char2:      #3a3a3a;   /* 副文字，深灰 */
  --char3:      #666;      /* 辅助文字，中灰 */
  --border:     rgba(30,30,30,.1);   /* 默认边框，10% 炭黑 */
  --border2:    rgba(30,30,30,.18);  /* 强调边框，18% 炭黑 */
  --accent:     #c4842a;   /* 付费/Pro 强调色，琥珀金 */
  --accent-light: #f0d4a0; /* 强调浅色，浅金 */
}
```

### 1.2 色彩用途映射

| 色彩 | 变量 | 用途 |
|------|------|------|
| 温暖白 | --white | body 背景、卡片默认背景（ct-item, tl-item）|
| 米白 | --off | zen-card 默认背景、hover 背景 |
| 暖灰 | --warm | zen-card hover 背景 |
| 浅棕 | --warm2 | 中文序号（ct-index）颜色 |
| 竹绿 | --sage | 季节标签、装饰线、墨分隔符、列表标记、logo圆点 |
| 深竹绿 | --sage2 | CTA按钮背景、hover文字色、免费标签色、下划线 |
| 暗竹绿 | --sage3 | CTA hover 背景、zen-card数字颜色 |
| 炭黑 | --char | 大标题、定价pick卡背景、footer背景 |
| 深灰 | --char2 | 文字链接默认色 |
| 中灰 | --char3 | 正文、辅助文字、导航链接默认色 |
| 10%边框 | --border | 默认边框、分隔线、网格背景色 |
| 18%边框 | --border2 | hover边框、文字链接下划线、定价按钮边框 |
| 琥珀金 | --accent | 付费标签、Pro标签 |
| 浅金 | --accent-light | （预留）强调浅色 |

### 1.3 深色反转（pc-card.pick）

定价卡推荐档位使用深色反转：
- 背景：`var(--char)` #1e1e1e
- 文字：`var(--white)` #fafaf7
- 辅助文字：`rgba(255,255,255,.35)`
- 列表项文字：`rgba(255,255,255,.6)`
- 列表项边框：`rgba(255,255,255,.06)`
- 列表标记：`rgba(255,255,255,.3)`
- 分隔线：`rgba(255,255,255,.1)`

---

## 2. 字体系统

### 2.1 三级字体定义

| 级别 | 字体栈 | 字重 | 用途 |
|------|--------|------|------|
| 标题字体 | `'Noto Serif SC', serif` | 500 | 页面大标题、区块标题、卡片标题、品牌名 |
| 正文字体 | `'Noto Sans SC', sans-serif` | 300 | 正文段落、描述文字、导航、按钮 |
| 装饰字体 | `'Shippori Mincho', serif` | 500 | 数据数字、中文序号 |

### 2.2 字体加载

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700&family=Noto+Sans+SC:wght@300;400&family=Shippori+Mincho:wght@400;500&display=swap" rel="stylesheet">
```

### 2.3 字号阶梯

| Token | 字号 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| hero-title | clamp(2.2rem, 5vw, 3.8rem) | 1.3 | 500 | Hero 主标题 |
| sec-title | 1.8rem | - | 500 | 区块标题 |
| pc-price | 3.2rem | - | 500 | 定价数字 |
| hero-kanji | 12rem | 1 | - | 汉字水印 |
| zc-num | 2rem | - | 500 | 数据卡片数字 |
| ct-index | 1.5rem | - | 500 | 内容卡片序号 |
| ct-name / tl-name | 1.1rem / 0.95rem | - | 500 | 卡片标题 |
| hero-verse / sec-haiku | 1rem / 0.88rem | 2 / 1.8 | italic | 诗句/俳句 |
| 正文 | 0.78-0.92rem | 1.7-1.8 | 300 | 描述、段落 |
| nav / 按钮文字 | 0.78-0.82rem | - | 300-400 | 导航、CTA |
| 标签类 | 0.6-0.7rem | - | 300 | 类型标签、底部信息 |
| 季节标签 | 0.62-0.65rem | - | - | section 上方的分类标签 |

### 2.4 字间距规范

| 用途 | letter-spacing |
|------|----------------|
| logo | 0.05em |
| 大标题 | 0.02em |
| 导航链接 | 0.1em |
| 按钮 | 0.1-0.2em |
| 季节标签 | 0.4em |
| 类型标签 | 0.2-0.3em |
| 底部标签 | 0.15-0.2em |
| 版权 | 0.1em |

---

## 3. 间距系统

### 3.1 页面级间距

| 位置 | 间距值 | 说明 |
|------|--------|------|
| Nav padding | 1.2rem (上下) × 6% (左右) | 固定导航栏内边距 |
| Hero padding | 7rem (上) × 6% (左右) × 5rem (下) | 首屏内边距（考虑nav高度）|
| Section padding | 4rem (上下) × 6% (左右) | 各内容区块统一间距 |
| Footer padding | 3rem (上下) × 6% (左右) | 底部区域 |

### 3.2 内容级间距

| 位置 | 间距值 |
|------|--------|
| Hero 双栏 gap | 5rem |
| 内容网格 gap | 1px（通过背景色模拟分隔线）|
| 工具网格 gap | 0.75rem |
| zen-card 之间 gap | 1rem |

### 3.3 元素级间距

| 元素 | margin-top | margin-bottom |
|------|-----------|---------------|
| hero-season | - | 2rem |
| hero-title | - | 1.5rem |
| hero-verse | - | 2.5rem |
| sec-season | - | 0.8rem |
| sec-title | - | 0.6rem |
| sec-haiku | - | 2rem |
| zc-num | - | 0.3rem |
| ct-index | - | 1rem |
| ct-type | - | 0.5rem |
| ct-name | - | 0.5rem |
| ct-foot | 1.2rem | - |
| tl-tag | 0.8rem | - |
| pc-tier | - | 1rem |
| pc-period | - | 1.5rem |
| pc-btn | 2rem (top) | - |
| pc-feats li | 0.35rem (上下) | - |

### 3.4 卡片内间距

| 卡片类型 | padding |
|----------|---------|
| zen-card | 1.8rem |
| ct-item | 2rem |
| tl-item | 1.3rem |
| pc-card | 2.5rem |

---

## 4. 圆角规范

| 元素 | border-radius | 说明 |
|------|---------------|------|
| zen-card | 4px | 极微圆角，近乎直角 |
| tl-item | 4px | 极微圆角 |
| btn-sage | 100px | 全圆角胶囊按钮 |
| nav-cta | 100px | 全圆角胶囊按钮 |
| pc-btn | 100px | 全圆角胶囊按钮 |
| ct-item | 0 | 无圆角（网格线分隔）|
| pc-card | 0 | 无圆角（网格线分隔）|
| hero-kanji | - | 文字，不适用 |
| logo-dot | 50% | 正圆 |

**设计理念**：容器类元素几乎无圆角（0-4px），营造利落、克制的东方美学；交互按钮使用全圆角（100px），提供明确的可点击暗示。

---

## 5. 边框规范

| 元素 | 边框样式 | 颜色 |
|------|----------|------|
| nav 底部 | 1px solid | var(--border) |
| zen-card | 1px solid | var(--border)，hover 时 var(--border2) |
| hero-verse 左侧 | 2px solid | var(--sage) |
| tl-item | 1px solid | var(--border)，hover 时 var(--border2) |
| ct-grid | 背景色模拟 | var(--border)，gap:1px |
| price-grid | 背景色模拟 | var(--border)，gap:1px |
| ct-foot 顶部 | 1px solid | var(--border) |
| pc-line | 1px solid | var(--border)，pick 卡内 rgba(255,255,255,.1) |
| pc-feats li 底部 | 1px solid | rgba(0,0,0,.04) |
| btn-plain 底部 | 1px solid | var(--border2)，hover 时 var(--sage2) |
| pc-btn | 1px solid | var(--border2)，hover 时 var(--sage2) |
| season-line | width:30px, 1px solid | var(--sage) |
| ink-div | flex:1, 1px | var(--border)（左右各一条）|

---

## 6. 阴影规范

**当前设计不使用 box-shadow。**

整个 demo-6-zen.html 无任何阴影属性。视觉层次通过以下方式实现：
- 背景色梯度（white → off → warm）
- 边框色变化（border → border2）
- 深色反转（pick 卡）

如未来需要阴影，建议：
- 卡片投影：`0 1px 3px rgba(30,30,30,.06)`
- 浮起状态：`0 4px 12px rgba(30,30,30,.08)`
- 弹窗/模态：`0 8px 24px rgba(30,30,30,.12)`

---

## 7. 动画规范

### 7.1 入场动画

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}
```

| 类名 | 效果 | 用途 |
|------|------|------|
| .fade-in | fadeIn 1s ease forwards | Hero 各元素入场 |
| .delay-1 | animation-delay: 0.2s; opacity: 0 | 二级延迟 |
| .delay-2 | animation-delay: 0.4s; opacity: 0 | 三级延迟 |
| .delay-3 | animation-delay: 0.6s; opacity: 0 | 四级延迟 |

**入场动画使用模式**：所有 `.fade-in` 元素初始 opacity 为 0，通过 animation forwards 保留终态。

### 7.2 Hover 过渡

| 属性 | transition | 使用场景 |
|------|-----------|----------|
| color | 0.2s | nav 链接、文字链接 |
| background-color | 0.3s | 卡片、按钮 |
| border-color | 0.3s | 卡片边框 |
| transform | 0.3s | CTA 按钮 translateY(-1px) |
| 综合 | transition: .3s | 大多数交互元素 |

### 7.3 过渡属性分配原则

- **0.2s**：纯颜色变化的轻交互（文字色、链接色）
- **0.3s**：涉及背景色、边框、位移的复合交互

### 7.4 滚动行为

```css
html { scroll-behavior: smooth; }
```

全页面平滑滚动，锚点跳转使用原生 smooth scroll。

### 7.5 推荐扩展动画（后续页面）

| 动画 | 用途 | 建议 |
|------|------|------|
| IntersectionObserver fadeIn | 非 Hero 区域的滚动入场 | 元素进入视口时添加 .fade-in 类 |
| 文章列表追加 | 加载更多时的列表项入场 | fadeIn 0.5s ease |
| 移动端导航 | 菜单抽屉滑入 | translateX + opacity, 0.3s |
| 目录高亮 | 当前阅读位置指示 | 背景色过渡 0.2s |

---

## 8. 组件库清单

### 8.1 Nav（导航栏）

```
结构：
nav
  .nav-inner (max-width:1100px, margin:0 auto, flex)
    a.logo
      .logo-text ("SOLO.X")
      .logo-dot (6×6 circle, sage)
    ul
      li > a (创作/工具/课程/关于)
    a.nav-cta ("开启会员")

样式：
  position: fixed, z-index: 100
  background: rgba(250,250,247,.95)
  backdrop-filter: blur(10px)
  padding: 1.2rem 6%
  border-bottom: 1px solid var(--border)
```

### 8.2 Hero-Card（数据卡片）

```
结构：
.zen-card
  .zc-num (数据数字，Shippori Mincho 2rem)
  .zc-label (标签，0.7rem 大写)
  .zc-desc (描述，0.78rem)

样式：
  background: var(--off)
  border: 1px solid var(--border)
  padding: 1.8rem
  border-radius: 4px
  hover: background → var(--warm), border → var(--border2)
```

### 8.3 Content-Grid（内容形式网格）

```
结构：
.ct-grid (grid 3×1fr, gap:1px, background:var(--border))
  .ct-item × 6
    .ct-index (中文序号：壹贰叁肆伍陆)
    .ct-type (英文类型标签)
    .ct-name (中文名称)
    .ct-desc (描述)
    .ct-foot (数量 + 价格标签)

样式：
  ct-item: background:var(--white), padding:2rem
  hover: background → var(--off)
  分隔线通过 grid gap:1px + 背景色实现
```

### 8.4 Tool-Card（工具卡片）

```
结构：
.tl-item
  .tl-name (工具名称)
  .tl-desc (工具描述)
  .tl-tag (免费/Pro 标签)

样式：
  padding: 1.3rem
  border: 1px solid var(--border)
  border-radius: 4px
  background: var(--white)
  hover: background → var(--off), border → var(--border2)
```

### 8.5 Pricing-Card（定价卡片）

```
结构：
.pc-card (或 .pc-card.pick)
  .pc-tier (档位名)
  .pc-price > sup(¥) + 金额
  .pc-period (周期说明)
  .pc-line (分隔线)
  ul.pc-feats > li × n (功能列表)
  a.pc-btn (CTA按钮)

样式：
  默认: background:var(--white), padding:2.5rem
  推荐档(.pick): background:var(--char), color:var(--white)
  分隔线通过 grid gap:1px + 背景色实现
  pc-btn: 圆角100px, hover时背景sage2+白字
```

### 8.6 Footer（页脚）

```
结构：
footer
  .f-brand ("SOLO" + span(".X"))
  .f-copy (版权文字)

样式：
  background: var(--char)
  color: rgba(250,250,247,.4)
  padding: 3rem 6%
  flex, space-between
```

### 8.7 Ink-Divider（墨分隔线）

```
结构：
.ink-div
  ::before (flex:1, 1px线)
  .ink-sym (汉字"竹")
  ::after (flex:1, 1px线)

样式：
  max-width: 1100px
  margin: 0 auto
  padding: 0 6%
  gap: 1.5rem
  ink-sym: color:var(--sage), font-size:0.9rem
  线: background:var(--border)
```

### 8.8 Subscribe-Form（订阅表单 - 待设计）

```
建议结构：
.subscribe-form
  input[type="email"]
  button (提交)

建议样式（沿用设计系统）：
  input: border:1px solid var(--border), padding:0.7rem 1.2rem
         border-radius:100px, font-size:0.82rem
  button: background:var(--sage2), color:white
          border-radius:100px, padding:0.7rem 1.5rem
```

### 8.9 Placeholder-Page（占位页面模板）

```
建议结构：
.page-hero
  .sec-season (分类标签)
  h1.sec-title (页面标题)
  p.sec-haiku (禅意副标题)
.content-preview (复用对应卡片网格)
.subscribe-section
  订阅提示 + subscribe-form

样式：沿用 .section 间距体系
```

---

## 9. 图标与装饰元素

### 9.1 竹纹背景 (.zen-bg)

```css
.zen-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.025;
  background-image:
    repeating-linear-gradient(90deg, var(--char) 0px, var(--char) 1px, transparent 1px, transparent 60px),
    repeating-linear-gradient(0deg, var(--char) 0px, var(--char) 1px, transparent 1px, transparent 60px);
}
```

- 60px 间距的横竖交叉细线
- 整体透明度仅 2.5%，极低存在感
- fixed 定位，不随滚动
- pointer-events: none，不影响交互

### 9.2 汉字水印 (.hero-kanji)

```css
.hero-kanji {
  font-family: 'Noto Serif SC', serif;
  font-size: 12rem;
  line-height: 1;
  color: rgba(125,155,118,.08);   /* sage 色 8% 透明度 */
  position: absolute;
  right: -2rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.05em;
}
```

- 当前使用「独」字
- 可根据页面主题更换（文章页：「文」、关于页：「我」、工具页：「器」等）

### 9.3 中文序号

使用 Shippori Mincho 字体渲染大写中文数字：

| 数字 | 汉字 | 用途 |
|------|------|------|
| 一 | 壹 | 内容卡片1 |
| 二 | 贰 | 内容卡片2 |
| 三 | 叁 | 内容卡片3 |
| 四 | 肆 | 内容卡片4 |
| 五 | 伍 | 内容卡片5 |
| 六 | 陆 | 内容卡片6 |

```css
.ct-index {
  font-family: 'Shippori Mincho', serif;
  font-size: 1.5rem;
  color: var(--warm2);  /* #d8d2c2 浅棕色 */
  font-weight: 500;
  margin-bottom: 1rem;
  display: block;
}
```

### 9.4 季节线 (.season-line)

```css
.season-line {
  width: 30px;
  height: 1px;
  background: var(--sage);
}
```

- 与季节标签搭配使用（hero-season, sec-season）
- 位于标签文字左侧，间距 0.6-0.7rem

### 9.5 墨分隔符 (ink-div)

- 居中显示汉字「竹」
- 两侧 1px 水平线延伸至内容边缘
- 间距 1.5rem

### 9.6 列表标记

定价卡功能列表使用圆点前缀：

```css
.pc-feats li::before {
  content: '・';
  color: var(--sage);        /* 默认卡 */
  /* pick卡内: color: rgba(255,255,255,.3) */
  flex-shrink: 0;
}
```

---

## 10. 响应式设计 Token

### 10.1 容器宽度

| Token | 值 | 用途 |
|-------|----|------|
| --container-max | 1100px | 全局最大内容宽度 |
| --content-max | 680px | 文章正文最大宽度 |
| --legal-max | 720px | 法律页面最大宽度 |
| --page-padding | 6% | 桌面端左右内边距 |

### 10.2 断点 Token（建议）

```css
/* 建议在 :root 中补充以下变量 */
:root {
  --bp-mobile:  767px;
  --bp-tablet:  1023px;
  --bp-desktop: 1024px;
  --bp-large:   1440px;
}
```

### 10.3 响应式间距 Token

| Token | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| --section-py | 4rem | 3rem | 2.5rem |
| --section-px | 6% | 4% | 5% |
| --nav-py | 1.2rem | 1rem | 0.8rem |
| --hero-gap | 5rem | 3rem | 0 |
| --card-padding-lg | 2.5rem | 2rem | 1.5rem |
| --card-padding-md | 2rem | 1.5rem | 1.2rem |
| --card-padding-sm | 1.3rem | 1rem | 1rem |
| --grid-gap | 0.75rem | 0.75rem | 0.5rem |

### 10.4 网格列数 Token

| 组件 | Desktop | Tablet | Mobile |
|------|---------|--------|--------|
| hero-inner | 2列 | 2列 | 1列 |
| ct-grid | 3列 | 2列 | 1列 |
| tools-scroll | 4列 | 2列 | 2列 |
| price-grid | 3列 | 3列 | 1列 |

### 10.5 响应式字号 Token（建议）

| Token | Desktop | Mobile |
|-------|---------|--------|
| --hero-title | clamp(2.2rem,5vw,3.8rem) | clamp(2.2rem,5vw,3.8rem) |
| --sec-title | 1.8rem | 1.4rem |
| --body-lg | 0.92rem | 0.92rem |
| --body | 0.78rem | 0.78rem |
| --label | 0.7rem | 0.7rem |
| --tag | 0.6rem | 0.6rem |

---

## 附录：完整 CSS 变量汇总

建议在实际项目中统一管理以下 CSS Variables：

```css
:root {
  /* === 色彩 === */
  --white:#fafaf7;
  --off:#f2f0ea;
  --warm:#e8e4d9;
  --warm2:#d8d2c2;
  --sage:#7d9b76;
  --sage2:#5a7a54;
  --sage3:#3d5939;
  --char:#1e1e1e;
  --char2:#3a3a3a;
  --char3:#666;
  --border:rgba(30,30,30,.1);
  --border2:rgba(30,30,30,.18);
  --accent:#c4842a;
  --accent-light:#f0d4a0;

  /* === 布局 === */
  --container-max: 1100px;
  --page-padding: 6%;

  /* === 动画 === */
  --ease-default: ease;
  --duration-fast: 0.2s;
  --duration-normal: 0.3s;
  --duration-slow: 1s;

  /* === 圆角 === */
  --radius-none: 0;
  --radius-subtle: 4px;
  --radius-pill: 100px;
  --radius-circle: 50%;

  /* === 层级 === */
  --z-bg: 0;
  --z-content: 1;
  --z-nav: 100;
}
```
