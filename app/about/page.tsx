import type { Metadata } from 'next';
import { SOCIAL_LINKS } from '@/lib/constants';

export const metadata: Metadata = {
  title: '关于',
  description: '独立创作者的自我介绍',
};

const SKILLS = [
  'TypeScript', 'React', 'Next.js', 'Python', 'Rust',
  'UI 设计', '排版', '技术写作', 'SEO', '产品思维',
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-avatar">独</div>
      <h1 className="about-name">SOLO.X 创始人</h1>
      <div className="about-bio">
        <p>
          一个相信「一个人也可以做出有价值的东西」的创作者。程序员出身，做过产品、写过文章、做过音乐，最终选择了一条把所有技能串联起来的路——一人公司。
        </p>
        <p>
          SOLO.X 是我的数字栖息地。这里记录了关于独立创作、技术实践和工具思维的一切。
        </p>
        <p>
          道法自然，少即是多。
        </p>
      </div>

      <h2 className="about-section-title">技能</h2>
      <div className="about-skills">
        {SKILLS.map((skill) => (
          <span key={skill} className="about-skill">{skill}</span>
        ))}
      </div>

      <h2 className="about-section-title">联系方式</h2>
      <div className="about-links">
        <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="about-link">GitHub</a>
        <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="about-link">Twitter</a>
        <a href={`mailto:${SOCIAL_LINKS.email}`} className="about-link">Email</a>
        <span className="about-link">WeChat: {SOCIAL_LINKS.wechat}</span>
      </div>
    </div>
  );
}
