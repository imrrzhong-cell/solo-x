import { PageHead } from '@/components/page-head';

export default function NotFound() {
  return (
    <>
      <PageHead
        kicker="404"
        title="页面未找到。"
        desc="你访问的页面可能已被移动、重命名，或从未存在。请检查链接，或返回已知的页面。"
        kanji="空"
      />

      <section className="section">
        <div className="container">
          <div className="button-row">
            <a href="/" className="btn-sage">返回首页</a>
            <a href="/map" className="btn-plain">查看导航页</a>
          </div>
        </div>
      </section>
    </>
  );
}
