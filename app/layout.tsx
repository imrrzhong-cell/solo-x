import type { Metadata } from 'next';
import { Noto_Serif_SC, Noto_Sans_SC } from 'next/font/google';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
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

export const metadata: Metadata = {
  title: {
    default: 'SOLO.X — 一人公司创作平台',
    template: '%s | SOLO.X',
  },
  description: '独立创作者的内容平台，汇聚文章、工具、课程与灵感',
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
    <html lang="zh-CN" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <body>
        <div className="zen-bg" />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
