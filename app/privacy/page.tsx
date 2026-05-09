import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策',
  description: 'SOLO.X 隐私政策',
};

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <h1>隐私政策</h1>
      <p className="legal-date">最后更新：2026 年 5 月 9 日</p>

      <h2>1. 信息收集范围</h2>
      <p>SOLO.X 仅收集以下个人信息：</p>
      <ul>
        <li>邮箱地址（用于内容更新通知）</li>
      </ul>
      <p>我们不会收集您的姓名、电话、身份证号、地理位置等敏感信息。</p>

      <h2>2. 信息使用目的</h2>
      <p>您提供的邮箱地址仅用于以下目的：</p>
      <ul>
        <li>发送内容更新通知</li>
        <li>发送您主动订阅的信息</li>
      </ul>
      <p>我们不会将您的邮箱用于其他用途，也不会向第三方出售或共享。</p>

      <h2>3. 信息存储方式</h2>
      <p>您的邮箱地址通过 Resend（邮件服务提供商）安全存储和管理。Resend 符合 SOC 2 Type II 安全标准，数据经过加密传输和存储。</p>
      <p>我们不在本地服务器存储任何订阅者数据。</p>

      <h2>4. 用户权利</h2>
      <p>根据《中华人民共和国个人信息保护法》，您享有以下权利：</p>
      <ul>
        <li><strong>查阅权</strong>：您有权了解我们持有您的哪些个人信息</li>
        <li><strong>更正权</strong>：您有权要求更正不准确的信息</li>
        <li><strong>删除权</strong>：您有权要求我们删除您的个人信息</li>
        <li><strong>退订权</strong>：您可以随时通过邮件底部的退订链接取消订阅</li>
      </ul>
      <p>如需行使上述权利，请通过关于页面的联系方式与我们联系。</p>

      <h2>5. Cookie 使用说明</h2>
      <p>本网站当前不使用 Cookie 或任何追踪技术。</p>

      <h2>6. 第三方服务说明</h2>
      <p>本网站使用以下第三方服务：</p>
      <ul>
        <li><strong>Resend</strong>：邮件订阅管理服务（resend.com）</li>
        <li><strong>Vercel</strong>：网站托管服务（vercel.com）</li>
      </ul>

      <h2>7. 政策更新方式</h2>
      <p>本隐私政策可能会不定期更新。重大变更将通过邮件通知订阅用户。继续使用本网站即表示您同意更新后的政策。</p>

      <h2>8. 联系方式</h2>
      <p>如有关于隐私政策的任何问题，请通过关于页面的联系方式与我们联系。</p>
    </div>
  );
}
