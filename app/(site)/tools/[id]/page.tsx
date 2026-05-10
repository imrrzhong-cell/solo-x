import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Newsletter } from '@/components/newsletter';
import { tools } from '@/lib/data';

export function generateStaticParams() {
  return tools.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return params.then(({ id }) => {
    const tool = tools.find((t) => t.id === id);
    if (!tool) return { title: '工具未找到' };
    return {
      title: `${tool.name} — SOLO.X 工具箱`,
      description: tool.desc,
    };
  });
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = tools.find((t) => t.id === id);
  if (!tool) notFound();

  const workflow = [
    { label: '输入', desc: '定义问题与素材' },
    { label: '处理', desc: '工具自动分析与生成' },
    { label: '输出', desc: '可交付的结构化结果' },
  ];

  const scenarios = [
    '独立创作者日常运营',
    '内容选题与判断',
    '产品封装与交付',
    '复盘与迭代优化',
  ];

  return (
    <>
      <PageHead
        kicker="OPC工具箱"
        title={tool.name}
        desc={tool.desc}
        kanji="器"
      />

      <section className="section">
        <div className="container">
          <div className="feature-band">
            <div>
              <h2 className="band-title">工具工作流</h2>
              <p className="band-desc">
                每款工具围绕一个固定动作设计：输入原始素材，经过结构化处理，输出可直接使用的成果。
              </p>
            </div>
            <div className="mini-grid">
              {workflow.map((step) => (
                <div key={step.label} className="mini">
                  <b>{step.label}</b>
                  <span>{step.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="panel">
              <h2 className="panel-title">适用场景</h2>
              <p className="panel-desc">
                这款工具适合以下使用情况：
              </p>
              <ul className="plain-list">
                {scenarios.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="panel off">
              <h2 className="panel-title">访问权限</h2>
              <p className="panel-desc">
                {tool.tier === 'FREE'
                  ? '这款工具对所有用户免费开放，无需订阅即可使用全部功能。'
                  : '这款工具为 Pro 会员专属，订阅后可解锁完整功能。'}
              </p>
              <ul className="plain-list">
                <li>类别：{tool.cat}</li>
                <li>权限：{tool.tier === 'FREE' ? '免费' : 'Pro 会员'}</li>
              </ul>
              <div style={{ marginTop: '1.5rem' }}>
                {tool.tier === 'FREE' ? (
                  <span className="btn-sage">开始使用</span>
                ) : (
                  <Link href="/pricing" className="btn-sage">
                    解锁 Pro
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
