import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '@/components/page-head';
import { Newsletter } from '@/components/newsletter';
import { courses } from '@/lib/data';

export const metadata: Metadata = {
  title: '视频课程',
  description: 'SOLO.X 视频课程 — OPC 方法论系统教程，从定位、产品、内容、工具到变现形成闭环。',
};

const IDX = ['壹', '贰', '叁', '肆', '伍', '陆'];

export default function CoursesPage() {
  return (
    <>
      <PageHead
        kicker="视频课程"
        title="OPC 方法论系统教程。"
        desc="系统化的视频教程，聚焦一人公司（OPC）方法论与 AI 工具实战。从零到一搭建你的独立创作体系——产品定位、内容策略、技术实现、商业变现，每个环节都有详细讲解。"
        kanji="课"
      />

      <section className="section">
        <div className="container">
          <div className="content-grid">
            {courses.map(([name, desc], i) => (
              <Link
                key={name}
                href={`/courses/${i + 1}`}
                className="ct-item"
              >
                <span className="ct-index">{IDX[i]}</span>
                <div className="ct-type">Course</div>
                <div className="ct-name">{name}</div>
                <div className="ct-desc">{desc}</div>
                <div className="ct-foot">
                  <span className="ct-count">系统课程</span>
                  <span className="ct-price price-paid">PRO</span>
                </div>
              </Link>
            ))}
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
