import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '使用条款',
  description: 'SOLO.X 使用条款',
};

export default function TermsPage() {
  return (
    <div className="legal">
      <h1>使用条款</h1>
      <p>最后更新：2026 年 5 月 9 日</p>

      <h2>服务范围</h2>
      <p>SOLO.X（以下简称「本站」）是一个独立创作者的内容平台，提供文章、工具、课程等内容服务。本站当前处于内测阶段，部分功能可能尚未完全就绪。</p>

      <h2>会员权益</h2>
      <p>会员分为三档：探索者（免费）、创作者（按月订阅）和年度会员。各档权益如下：</p>
      <ul>
        <li><strong>探索者</strong>：免费内容无限阅读，基础工具 6 款，每月 3 篇付费内容</li>
        <li><strong>创作者</strong>：全部内容无限访问，18 款 Pro 工具全解锁，视频课程完整访问，创作者专属社群</li>
        <li><strong>年度会员</strong>：创作者全部权益，年度独家研究报告，1v1 问答机会，新功能优先体验</li>
      </ul>

      <h2>内容版权</h2>
      <p>本站所有原创内容（包括但不限于文章、设计、代码、图像）均受著作权法保护。未经明确授权，禁止全文转载。</p>
      <p>合理引用（引用部分内容并注明出处）是被允许和鼓励的。</p>

      <h2>联系</h2>
      <p>如有关于使用条款的任何问题，请通过联系页面与我们取得联系。</p>
    </div>
  );
}
