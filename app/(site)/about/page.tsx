import type { Metadata } from 'next';
import { PageHead } from '@/components/page-head';
import { InkDivider } from '@/components/ink-divider';

export const metadata: Metadata = {
  title: '关于',
  description: '一个人，也可以成为完整系统。关于 SOLO.X 的理念与建设者。',
};

const SKILLS = [
  'TypeScript', 'React', 'Next.js', 'Python', 'Rust',
  'UI 设计', '排版', '技术写作', 'SEO', '产品思维',
];

const BELIEFS = [
  '少即是多，复杂度是敌人。',
  '工具决定上限，流程决定下限。',
  '透明建设，让信任自然生长。',
  '一人公司不是缩小版公司，是全新物种。',
  '内容是资产，不是流量。',
];

const TIMELINE = [
  { title: '内容资产', desc: '从写作出发，建立文章、音乐、视频的长期知识资产库。每一篇内容都是可复用的认知积累。' },
  { title: '工具封装', desc: '把重复出现的判断和流程封装为可执行工具。18 款 OPC 工具箱，覆盖创作与运营全链路。' },
  { title: '课程系统', desc: '将方法论系统化，形成从定位、内容、产品到变现的完整课程体系。' },
  { title: '会员生态', desc: '建立三档会员体系，让免费用户了解、付费用户使用、年度用户同行。' },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        kicker="关于 SOLO.X"
        title="一个人，也可以成为完整系统。"
        desc="SOLO.X 是一个独立创作者的数字栖息地，记录关于技术实践、工具思维和一人公司方法论的一切。"
        kanji="独"
      />

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="panel">
              <h2 className="panel-title">建设者</h2>
              <p className="panel-desc">
                一个相信「一个人也可以做出有价值的东西」的创作者。程序员出身，做过产品、写过文章、做过音乐，最终选择了一条把所有技能串联起来的路——一人公司。
              </p>
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
                {SKILLS.map((s) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>

            <div className="panel off">
              <h2 className="panel-title">理念</h2>
              <p className="panel-desc">
                道法自然，少即是多。SOLO.X 不追求规模，追求系统密度——把判断、生产、分发和变现压缩到个人可以运行的完整生态。
              </p>
              <ul className="plain-list">
                {BELIEFS.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <InkDivider sym="竹" />

      <section className="section alt">
        <div className="container">
          <div className="section-header">
            <div className="sec-season">建设轨迹</div>
            <h2 className="sec-title">从零到系统的四步。</h2>
          </div>
          <div className="timeline">
            {TIMELINE.map((t) => (
              <div key={t.title} className="time-item">
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
