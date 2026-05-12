export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'SOLO.X';
export const SITE_DESCRIPTION = '独立创作者的内容平台，汇聚文章、工具、课程与灵感';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://solo-x.vercel.app';

export const NAV_LINKS = [
  { href: '/', label: '首页', feature: null },
  { href: '/articles', label: '创作', feature: 'ARTICLES' },
  { href: '/about', label: '关于', feature: null },
];

export const SOCIAL_LINKS = {
  github: '#',
  twitter: '#',
  email: '#',
  wechat: '#',
};
