import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策',
  description: 'SOLO.X 隐私政策',
};

export default function PrivacyPage() {
  return (
    <div className="legal">
      <h1>隐私政策</h1>
      <p>最后更新：2026 年 5 月 9 日</p>

      <h2>信息收集范围</h2>
      <p>SOLO.X 仅收集以下个人信息：</p>
      <ul>
        <li>邮箱地址（用于内容更新通知）</li>
      </ul>
      <p>我们不会收集您的姓名、电话、身份证号、地理位置等敏感信息。</p>

      <h2>信息使用目的</h2>
      <p>您提供的邮箱地址仅用于以下目的：</p>
      <ul>
        <li>发送内容更新通知</li>
        <li>发送您主动订阅的信息</li>
      </ul>
      <p>我们不会将您的邮箱用于其他用途，也不会向第三方出售或共享。</p>

      <h2>用户权利</h2>
      <p>根据《中华人民共和国个人信息保护法》，您享有以下权利：</p>
      <ul>
        <li><strong>查阅权</strong>：您有权了解我们持有您的哪些个人信息</li>
        <li><strong>更正权</strong>：您有权要求更正不准确的信息</li>
        <li><strong>删除权</strong>：您有权要求我们删除您的个人信息</li>
        <li><strong>退订权</strong>：您可以随时通过邮件底部的退订链接取消订阅</li>
      </ul>
      <p>如需行使上述权利，请通过联系页与我们联系。</p>

      <h2>联系</h2>
      <p>如有关于隐私政策的任何问题，请通过联系页面与我们取得联系。</p>
    </div>
  );
}
