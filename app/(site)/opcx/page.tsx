import type { Metadata } from 'next';
import { PageHead } from '@/components/page-head';
import { InkDivider } from '@/components/ink-divider';

export const metadata: Metadata = {
  title: 'OPC METHOD',
  description: '一人公司，不靠意志力运行。OPC 方法论的完整路径。',
};

const STEPS = [
  { title: '找母题', desc: '找到你的长期表达方向——一个你可以写 100 篇、做 10 个产品、持续迭代 5 年的核心命题。' },
  { title: '建资产', desc: '围绕母题，持续生产文章、音乐、视频等内容资产。每一条都是可复用、可检索的认知积累。' },
  { title: '封工具', desc: '把重复出现的判断和流程封装为工具。从内容到产品的关键一步，是从表达走向可执行界面。' },
  { title: '做会员', desc: '设计三档会员体系，让免费用户了解、付费用户使用、年度用户同行。定价本身是产品设计。' },
  { title: '复盘迭代', desc: '月度更新、公开建设、持续优化。一人公司的优势不是快，是可持续。' },
];

const VALUES = [
  { type: '表', name: '表层：内容与工具', desc: '文章、音乐、视频课程、小程序、Web 应用和创意游戏——六种形式覆盖创作全场景。' },
  { type: '中', name: '中层：方法论系统', desc: 'OPC 方法论将定位、内容、产品、分发和变现串联为可执行的闭环系统。' },
  { type: '深', name: '深层：价值观', desc: '道法自然，少即是多。透明建设，让信任在长期轨迹中自然生成。一人公司是全新物种，不是缩小版公司。' },
];

export default function OpcxPage() {
  return (
    <>
      <PageHead
        kicker="OPC METHOD"
        title="一人公司，不靠意志力运行。"
        desc="OPC（One Person Company）方法论是一套让个人创作者可持续运转的系统。从定位到变现，五步闭环。"
        kanji="道"
      />

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="sec-season">落地路径</div>
            <h2 className="sec-title">五步闭环，从定位到变现。</h2>
          </div>
          <div className="pathway">
            {STEPS.map((s, i) => (
              <div key={s.title} className="step">
                <div className="step-num">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InkDivider sym="竹" />

      <section className="section alt">
        <div className="container">
          <div className="section-header">
            <div className="sec-season">三层价值</div>
            <h2 className="sec-title">表、中、深，层层递进。</h2>
          </div>
          <div className="ct-grid">
            {VALUES.map((v) => (
              <div key={v.type} className="ct-item">
                <div className="ct-type">{v.type}</div>
                <div className="ct-name">{v.name}</div>
                <div className="ct-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
