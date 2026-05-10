import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Newsletter } from '@/components/newsletter';
import { courses } from '@/lib/data';

export function generateStaticParams() {
  return courses.map((_, i) => ({ id: String(i + 1) }));
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return params.then(({ id }) => {
    const idx = Number(id) - 1;
    const course = courses[idx];
    if (!course) return { title: '课程未找到' };
    return {
      title: `${course[0]} — SOLO.X 课程`,
      description: course[1],
    };
  });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = Number(id) - 1;
  const course = courses[idx];
  if (!course) notFound();

  const objectives = [
    '理解核心概念与框架',
    '掌握实际操作步骤',
    '完成可交付的练习成果',
    '形成可复用的个人方法论',
  ];

  const structure = [
    '概念引入与问题定义',
    '方法论拆解与案例',
    '实操演示与工具使用',
    '练习作业与复盘总结',
  ];

  return (
    <>
      <PageHead
        kicker="视频课程"
        title={course[0]}
        desc={course[1]}
        kanji="课"
      />

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="panel">
              <h2 className="panel-title">学习目标</h2>
              <p className="panel-desc">
                完成本课程后，你将具备以下能力：
              </p>
              <ul className="plain-list">
                {objectives.map((obj) => (
                  <li key={obj}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="panel off">
              <h2 className="panel-title">课程结构</h2>
              <p className="panel-desc">
                系统化的学习路径，每一步都有明确交付：
              </p>
              <ul className="plain-list">
                {structure.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <div style={{ marginTop: '1.5rem' }}>
                <Link href="/pricing" className="btn-sage">
                  解锁完整课程
                </Link>
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
