import type { Metadata } from 'next';
import { Noto_Serif_SC, Noto_Sans_SC, Shippori_Mincho } from 'next/font/google';
import './globals.css';

const notoSerif = Noto_Serif_SC({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

const notoSans = Noto_Sans_SC({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const shipporiMincho = Shippori_Mincho({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mincho',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SOLO.X — 一人公司创作平台',
    template: '%s | SOLO.X',
  },
  description: 'SOLO.X 是中文世界的一人公司创作平台，用一个人的力量，构建六种内容形式，打造一个完整的商业生态。',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://solo-x.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'SOLO.X',
    images: ['/images/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSerif.variable} ${notoSans.variable} ${shipporiMincho.variable}`}>
      <body>
        <div className="zen-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
