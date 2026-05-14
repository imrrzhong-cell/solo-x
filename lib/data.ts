export interface ContentForm {
  idx: string;
  type: string;
  name: string;
  desc: string;
  count: string;
  price: string;
  route: string;
}

export const contentForms: ContentForm[] = [
  { idx: '壹', type: 'ARTICLES', name: '深度文章', desc: '成熟长文、观察札记、工具推荐和月度动态，构成 SOLO.X 的长期知识资产。', count: '86篇', price: 'FREE / PRO', route: '/articles' },
  { idx: '贰', type: 'MUSIC', name: '原创音乐', desc: '为内容、视频和产品叙事制作的原创音乐，强调情绪密度和品牌记忆。', count: '32首', price: 'FREE', route: '/music' },
  { idx: '叁', type: 'COURSES', name: '视频课程', desc: 'OPC 方法论系统教程，从定位、产品、内容、工具到变现形成闭环。', count: '12节', price: 'PRO', route: '/courses' },
  { idx: '肆', type: 'WEB APPS', name: '网页应用', desc: 'AI 写作、品牌命名、选题判断、商业灵感整理等可直接使用的 Web 工具。', count: '9款', price: 'PRO', route: '/webapps' },
  { idx: '伍', type: 'GAMES', name: '创意游戏', desc: '把方法论做成可体验的轻量网页游戏，让抽象框架变成可感知练习。', count: '5款', price: 'FREE', route: '/games' },
];

export interface Tool {
  id: string;
  idx: string;
  name: string;
  desc: string;
  tier: string;
  cat: string;
}

const toolRaw: [string, string, string, string][] = [
  ['选题罗盘', '判断一个选题是否具备传播、产品化和长期复利价值。', 'FREE', 'Strategy'],
  ['标题炼金室', '把普通标题压缩成具备点击理由和认知张力的标题组。', 'PRO', 'Content'],
  ['GEO 摘要器', '生成适合 AI 引用的文章摘要、实体定义和问题回答。', 'PRO', 'GEO'],
  ['品牌命名器', '围绕定位、语义、音节和可注册性生成品牌命名方案。', 'FREE', 'Brand'],
  ['卖点压缩器', '把复杂功能压缩为用户能立刻理解的购买理由。', 'PRO', 'Sales'],
  ['课程骨架机', '根据目标用户和交付结果生成课程大纲与章节结构。', 'PRO', 'Course'],
  ['灵感卡片机', '把碎片想法整理成 Obsidian 友好的原子化商业卡片。', 'FREE', 'Knowledge'],
  ['文章重构器', '将草稿重构为导语、结构、反常识观点和传播切片。', 'PRO', 'Writing'],
  ['用户画像镜', '从评论、私信、问卷中提炼真实用户需求和表达语言。', 'PRO', 'Research'],
  ['定价阶梯器', '设计免费、月付、年度三档权益边界与转化理由。', 'PRO', 'Revenue'],
  ['工具说明书', '把一个小工具写成可被用户理解和使用的落地页。', 'FREE', 'Product'],
  ['复盘切片器', '把项目复盘拆成判断、动作、结果、教训和下一步。', 'FREE', 'Ops'],
  ['内容日历', '生成适合一人公司的低负担内容发布节奏。', 'PRO', 'Ops'],
  ['销售页冷启动', '从价值主张到 FAQ 一次性生成基础销售页面。', 'PRO', 'Sales'],
  ['视频脚本机', '生成用于口播、课程或短视频的结构化脚本。', 'PRO', 'Video'],
  ['社群议题池', '设计适合会员社群讨论和共创的问题池。', 'PRO', 'Community'],
  ['资产盘点表', '盘点已有文章、工具、课程和可复用素材。', 'FREE', 'System'],
];

const idxChars = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾', '拾壹', '拾贰', '拾叁', '拾肆', '拾伍', '拾陆', '拾柒', '拾捌'];

export const tools: Tool[] = toolRaw.map((x, i) => ({
  id: `tool-${i + 1}`,
  idx: idxChars[i],
  name: x[0],
  desc: x[1],
  tier: x[2],
  cat: x[3],
}));

export interface Article {
  slug: string;
  type: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  read: string;
  premium: boolean;
  body: string[];
}

export const articles: Article[] = [
  { slug: 'opc-asset-consciousness', type: 'Essay', title: '不功利沟通：聊聊一人公司的资产意识', excerpt: '一人公司这种模式，现在越来越值得认真对待。人生不能只有一份工资，还要有一点真正属于自己的资产。从选人群到建信任，从做产品到养复利，一篇文章讲透一人公司的底层逻辑。', tags: ['一人公司', 'OPC', '资产意识', '独立创业'], date: '2026-05-14', read: '25 min', premium: false, body: [] },
  { slug: 'one-person-company-operating-system', type: 'Essay', title: '一人公司的操作系统', excerpt: '一人公司不是缩小版公司，而是一套把判断、生产、分发和变现压缩到个人体内的系统。', tags: ['OPC', '商业系统', 'AI'], date: '2026-05-01', read: '18 min', premium: true, body: ['一人公司的核心问题不是人少，而是系统密度不够。传统公司用组织结构吸收复杂度，一人公司只能用工具、流程和判断模型吸收复杂度。', '真正有效的一人公司，会把每天重复发生的动作沉淀为组件：选题判断、内容生产、产品封装、销售页面、用户反馈、复盘记录。组件一旦稳定，个人就不再被单点任务吞没。', 'SOLO.X 的价值在于公开这套组件如何被生产、使用和迭代。你看到的不是完成品陈列，而是一个商业生态的形成过程。'] },
  { slug: 'geo-as-content-infrastructure', type: 'Tool', title: 'GEO 是新的内容基础设施', excerpt: '当搜索入口变成生成式回答，内容生产的目标从排名转向可引用、可提取、可信任。', tags: ['GEO', '内容', '增长'], date: '2026-04-22', read: '12 min', premium: false, body: ['GEO 的第一性原理很简单：让生成式引擎在需要回答某个问题时，能够发现你、理解你、引用你。', '这要求内容从情绪表达走向结构表达。标题、摘要、实体、定义、步骤、证据链，都需要以机器可解析的形式出现。', '未来的内容资产会同时服务两类读者：人类读者需要理解成本更低，机器读者需要检索与引用成本更低。'] },
  { slug: 'ai-toolbox-for-solo-creators', type: 'Note', title: 'AI 工具箱的边界', excerpt: '工具不是越多越好，真正的工具箱要围绕稳定任务链展开，减少切换和重复劳动。', tags: ['工具箱', '效率', 'AI'], date: '2026-04-12', read: '9 min', premium: false, body: ['工具箱的价值不来自数量，而来自任务链覆盖率。一个工具不能进入稳定任务链，它就只是玩具。', '一人公司最关键的工具链通常只有五条：研究、写作、设计、开发、分发。每条链只保留最少但最强的工具。', '工具选择的最终标准是：能不能减少一个固定动作的认知成本。'] },
  { slug: 'from-content-to-product', type: 'Essay', title: '从内容走向产品', excerpt: '内容给你信任，产品给你收入。两者之间缺少的是可重复交付的结果。', tags: ['产品化', '内容创业'], date: '2026-03-30', read: '15 min', premium: true, body: ['内容创业者最容易停在表达层。表达可以建立吸引力，但很难稳定变现。', '产品化的关键，是把读者反复出现的问题转化成明确结果，再把这个结果封装为工具、课程、模板或服务。', '内容负责解释问题，产品负责解决问题。只有两者形成回路，个人品牌才会进入商业状态。'] },
  { slug: 'now-update-april', type: 'Now Update', title: '四月动态：从内容库到工具库', excerpt: '这个月的主线是把分散的内容判断沉淀为工具，把灵感从笔记移动到可执行界面。', tags: ['月度动态', '建设记录'], date: '2026-04-30', read: '7 min', premium: false, body: ['四月主要完成三件事：重构文章类型、整理 OPC 工具箱、启动课程大纲。', '最大的变化是把「写过的东西」转化成「可反复调用的工具」。这一步很慢，但会改变整个网站的商业重心。', '下个月的重点是订阅系统和会员入口。'] },
  { slug: 'smidgeon-pattern-recognition', type: 'Smidgeon', title: '模式识别的成本', excerpt: '识别模式本身不难，难的是把模式压缩成别人也能复用的结构。', tags: ['灵感', '认知'], date: '2026-04-04', read: '4 min', premium: false, body: ['很多人以为模式识别是一种灵感能力，其实它更接近压缩能力。', '你要把大量现象压成一个可迁移结构，然后再把结构翻译成可执行动作。', '无法被别人使用的模式，只是私人感受。'] },
  { slug: 'pricing-as-product-design', type: 'Tool', title: '定价本身是一种产品设计', excerpt: '价格不是最后一步，它会反向塑造你的内容层级、工具边界和会员权益。', tags: ['定价', '会员'], date: '2026-03-16', read: '11 min', premium: true, body: ['定价不是给已经完成的产品贴标签，它会反向决定产品要做到什么程度。', '免费层负责让用户理解你，月付层负责让用户使用你，年度层负责让用户相信你会长期进化。', '三档定价的设计要避免权益堆砌，必须让每一档对应一种明确的用户状态。'] },
  { slug: 'transparent-building', type: 'Essay', title: '透明建设的商业价值', excerpt: '把建设过程公开，不是分享日常，而是让信任在长期轨迹中自然生成。', tags: ['公开建设', '信任'], date: '2026-02-28', read: '13 min', premium: false, body: ['透明建设不是流水账。它的本质是让外部用户看到你的判断如何形成，你的产品如何进化。', '这会降低交易之前的信任成本。用户不只看到结果，也看到你处理问题的方式。', '对于一人公司，过程就是资产的一部分。'] },
];

export const music = [
  ['雨后庭院', '3:42', '用于低声叙述、复盘和方法论开场。'],
  ['旧纸灯', '2:58', '木质打击与低频铺底，适合工具演示。'],
  ['一人茶室', '4:16', '慢速旋律，服务长期主义与安静写作场景。'],
  ['竹影循环', '1:48', '网页动效与短视频转场循环音乐。'],
  ['墨线行走', '3:12', '适合课程章节之间的理性过渡。'],
  ['夜半原稿', '2:34', '更深、更克制的写作背景音乐。'],
];

export const courses = [
  ['定位', '找到一人公司最小可行市场和长期表达母题。'],
  ['内容', '搭建文章、视频、工具说明书的稳定生产线。'],
  ['产品', '把方法论封装为工具、课程、模板和轻应用。'],
  ['分发', '建立 SEO、GEO、社交平台和邮件订阅的入口矩阵。'],
  ['变现', '设计会员、工具、咨询、课程的组合模型。'],
  ['复盘', '用月度更新和公开建设沉淀长期信任。'],
];

export const webapps = [
  ['AI 写作工坊', '从选题到成稿的一体化写作工作台。'],
  ['品牌命名室', '名称、口号、域名方向和语义资产生成。'],
  ['GEO 体检台', '检查文章是否适合被 AI 搜索与引用。'],
  ['课程生成器', '根据交付目标生成课程结构和脚本。'],
  ['销售页编译器', '把产品信息转成高转化落地页骨架。'],
  ['内容资产库', '检索、归类、重用已有文章和灵感。'],
];

export const games = [
  ['选题试炼', '在 60 秒内判断选题是否值得做。'],
  ['现金流迷宫', '模拟一人公司收入、成本和时间分配。'],
  ['标题棋局', '用有限词汇组合出传播张力。'],
  ['工具塔防', '用自动化工具抵御重复劳动。'],
  ['产品炼丹炉', '把内容素材炼成工具、模板或课程。'],
];

export interface PageEntry {
  route: string;
  name: string;
  desc: string;
}

export const pages: PageEntry[] = [
  { route: '/', name: '首页', desc: '核心入口，展示定位、六种内容形式、工具箱、会员计划。' },
  { route: '/articles', name: '文章列表', desc: '反向时间流、类型筛选、文章卡片和详情页入口。' },
  { route: '/article/[slug]', name: '文章详情', desc: '标题、元数据、正文、代码块、订阅入口。' },
  { route: '/music', name: '原创音乐', desc: '音乐作品展示与播放型列表。' },
  { route: '/courses', name: '视频课程', desc: 'OPC 方法论教程与课程落地页。' },
  { route: '/webapps', name: '网页应用', desc: 'AI 写作、品牌命名等 Web 工具。' },
  { route: '/games', name: '创意游戏', desc: '轻量网页游戏和方法论体验。' },
  { route: '/tools', name: 'OPC 工具箱', desc: '18 款效率工具，含免费和 Pro 标签。' },
  { route: '/tool/[id]', name: '工具详情', desc: '单个工具的用途、流程、输入输出和会员 CTA。' },
  { route: '/pricing', name: '会员计划', desc: '三档定价与权益对比。' },
  { route: '/about', name: '关于页', desc: '个人简介、能力标签、建设时间线。' },
  { route: '/contact', name: '联系页', desc: '合作、订阅、咨询入口。' },
  { route: '/privacy', name: '隐私政策', desc: '邮件订阅与个人信息处理说明。' },
  { route: '/terms', name: '使用条款', desc: '会员、内容、工具和责任边界。' },
  { route: '/opcx', name: 'OPC 落地页', desc: '面向转化的一人公司方法论入口。' },
  { route: '/map', name: '导航页', desc: '完整路由地图。' },
];
