import { InkDivider } from '@/components/ink-divider';
import { ZenCard } from '@/components/zen-card';
import { SubscribeForm } from '@/components/subscribe-form';
import { isFeatureEnabled, type FeatureKey } from '@/lib/features';

const CONTENT_ITEMS: {
  key: FeatureKey;
  index: string;
  type: string;
  name: string;
  desc: string;
  count: string;
  priceClass: string;
  priceLabel: string;
}[] = [
  { key: 'ARTICLES', index: '壹', type: 'Articles', name: '深度文章', desc: '商业、技术、创作方法论，86篇原创深度内容', count: '86篇', priceClass: 'price-paid', priceLabel: '部分付费' },
  { key: 'MUSIC', index: '贰', type: 'Music', name: '原创音乐', desc: '32首原创，记录每个创作阶段的声音情绪', count: '32首', priceClass: 'price-free', priceLabel: '全部免费' },
  { key: 'COURSES', index: '叁', type: 'Video', name: '视频课程', desc: 'OPC方法论与AI工具实战的系统化教程', count: '24集', priceClass: 'price-paid', priceLabel: '订阅付费' },
  { key: 'APPS', index: '肆', type: 'Mini App', name: '微信小程序', desc: '效率工具与数据看板，独立创作者专用', count: '8款', priceClass: 'price-paid', priceLabel: '按需付费' },
  { key: 'WEBAPPS', index: '伍', type: 'Web App', name: '网页应用', desc: 'AI写作、品牌命名等12款专业Web工具', count: '12款', priceClass: 'price-paid', priceLabel: 'Freemium' },
  { key: 'GAMES', index: '陆', type: 'Games', name: '创意游戏', desc: '轻量网页游戏，在游玩中探索创业与决策', count: '6款', priceClass: 'price-paid', priceLabel: '部分付费' },
];

export default function Home() {
  return (
    <>
      <div className="hero">
        <div className="hero-kanji">独</div>
        <div className="hero-inner">
          <div className="hero-left">
            <p className="hero-season fade-in">
              <span className="season-line" />
              GEO驱动 · 一人公司 · 创作生态
            </p>
            <h1 className="hero-title fade-in delay-1">
              独行者<br />创造的<br />无限可能
            </h1>
            <p className="hero-verse fade-in delay-2">
              文字之间，有光。<br />
              音乐之中，有意。<br />
              一人之力，可改变。
            </p>
            <div className="hero-btns fade-in delay-3">
              <a href="#content" className="btn-sage">探索内容</a>
              <a href="#pricing" className="btn-plain">了解会员 →</a>
            </div>
          </div>
          <div className="hero-right fade-in delay-2">
            <ZenCard num="240+" label="原创内容" desc="文章、音乐、视频、小程序与游戏" />
            <ZenCard num="18" label="专业工具" desc="覆盖OPC运营全链路的效率工具" />
            <ZenCard num="5K+" label="订阅会员" desc="同频创作者的共同成长社群" />
          </div>
        </div>
      </div>

      <InkDivider />

      <div className="section" id="content">
        <p className="sec-season"><span className="season-line" />内容创作</p>
        <h2 className="sec-title">六种形式，一个宇宙</h2>
        <p className="sec-haiku">每一篇文字，每一段旋律，都是创作者灵魂的真实回响</p>
        <div className="ct-grid">
          {CONTENT_ITEMS.map((item) => {
            const enabled = isFeatureEnabled(item.key);
            return (
              <div key={item.key} className="ct-item" style={!enabled ? { opacity: 0.5 } : undefined}>
                <span className="ct-index">{item.index}</span>
                <div className="ct-type">{item.type}</div>
                <div className="ct-name">{item.name}</div>
                <div className="ct-desc">{item.desc}</div>
                <div className="ct-foot">
                  <span className="ct-count">{item.count}</span>
                  <span className={`ct-price ${item.priceClass}`}>
                    {enabled ? item.priceLabel : '即将推出'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <InkDivider />

      <div className="section" id="tools">
        <p className="sec-season"><span className="season-line" />OPC工具箱</p>
        <h2 className="sec-title">效率，是最好的禅</h2>
        <p className="sec-haiku">18款精选工具，覆盖内容创作与商业运营的全链路</p>
        <div className="tools-scroll">
          <div className="tl-item">
            <div className="tl-name">AI内容生成器</div>
            <div className="tl-desc">结合个人风格的写作助手</div>
            <div className="tl-tag tl-free">免费工具</div>
          </div>
          <div className="tl-item">
            <div className="tl-name">定价策略计算</div>
            <div className="tl-desc">数字产品最优定价建议</div>
            <div className="tl-tag tl-free">免费工具</div>
          </div>
          <div className="tl-item">
            <div className="tl-name">品牌定位分析</div>
            <div className="tl-desc">个人品牌诊断与优化</div>
            <div className="tl-tag tl-pro">Pro专属</div>
          </div>
          <div className="tl-item">
            <div className="tl-name">社媒排期系统</div>
            <div className="tl-desc">多平台内容分发管理</div>
            <div className="tl-tag tl-pro">Pro专属</div>
          </div>
          <div className="tl-item">
            <div className="tl-name">收入追踪看板</div>
            <div className="tl-desc">多渠道收入可视化</div>
            <div className="tl-tag tl-pro">Pro专属</div>
          </div>
          <div className="tl-item">
            <div className="tl-name">GEO可见度检测</div>
            <div className="tl-desc">AI搜索引擎优化评分</div>
            <div className="tl-tag tl-pro">Pro专属</div>
          </div>
          <div className="tl-item">
            <div className="tl-name">选题研究引擎</div>
            <div className="tl-desc">发现高价值内容选题</div>
            <div className="tl-tag tl-free">免费工具</div>
          </div>
          <div className="tl-item">
            <div className="tl-name">邮件营销系统</div>
            <div className="tl-desc">轻量邮件列表运营</div>
            <div className="tl-tag tl-pro">Pro专属</div>
          </div>
        </div>
      </div>

      <InkDivider />

      <div className="section" id="pricing">
        <p className="sec-season"><span className="season-line" />会员计划</p>
        <h2 className="sec-title">选择你的创作境界</h2>
        <div className="price-grid">
          <div className="pc-card">
            <div className="pc-tier">探索者</div>
            <div className="pc-price"><sup>¥</sup>0</div>
            <div className="pc-period">永久免费</div>
            <div className="pc-line" />
            <ul className="pc-feats">
              <li>免费内容无限阅读</li>
              <li>基础工具6款</li>
              <li>每月3篇付费内容</li>
              <li>广告支持版本</li>
            </ul>
            <a href="#" className="pc-btn">免费开始</a>
          </div>
          <div className="pc-card pick">
            <div className="pc-tier">创作者</div>
            <div className="pc-price"><sup>¥</sup>68</div>
            <div className="pc-period">/ 月 · 按月订阅</div>
            <div className="pc-line" />
            <ul className="pc-feats">
              <li>全部内容无限访问</li>
              <li>18款Pro工具全解锁</li>
              <li>视频课程完整访问</li>
              <li>全部小程序与Web App</li>
              <li>无广告纯净体验</li>
              <li>创作者专属社群</li>
            </ul>
            <a href="#" className="pc-btn">开启创作者</a>
          </div>
          <div className="pc-card">
            <div className="pc-tier">年度会员</div>
            <div className="pc-price"><sup>¥</sup>580</div>
            <div className="pc-period">/ 年 · 节省28%</div>
            <div className="pc-line" />
            <ul className="pc-feats">
              <li>创作者全部权益</li>
              <li>年度独家研究报告</li>
              <li>1v1问答机会</li>
              <li>新功能优先体验</li>
              <li>专属年度徽章</li>
            </ul>
            <a href="#" className="pc-btn">选择年度</a>
          </div>
        </div>
      </div>

      <SubscribeForm source="homepage" />
    </>
  );
}
