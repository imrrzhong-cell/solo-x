export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'SOLO.X';
export const SITE_DESCRIPTION = '独立创作者的内容平台，汇聚文章、工具、课程与灵感';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://solo-x.vercel.app';

export const NAV_LINKS = [
  { href: '/articles', label: '创作', feature: 'ARTICLES' },
  { href: '/tools', label: '工具', feature: 'TOOLS' },
  { href: '/courses', label: '课程', feature: 'COURSES' },
  { href: '/about', label: '关于', feature: null },
];

export const SOCIAL_LINKS = {
  github: 'https://github.com/your-username',
  twitter: 'https://twitter.com/your-username',
  email: 'your@email.com',
  wechat: 'your-wechat-id',
};
