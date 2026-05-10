import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticleBySlug, getAllSlugs } from '@/lib/articles';
import { mdxComponents } from '@/lib/mdx';
import { SITE_URL } from '@/lib/constants';
import { Newsletter } from '@/components/newsletter';
import { articles as dataArticles } from '@/lib/data';

export async function generateStaticParams() {
  const mdxSlugs = getAllSlugs();
  const dataSlugs = dataArticles.map((a) => a.slug);
  const allSlugs = Array.from(new Set([...mdxSlugs, ...dataSlugs]));
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const mdxArticle = getArticleBySlug(slug);
  if (mdxArticle) {
    const { frontmatter } = mdxArticle;
    const url = `/articles/${slug}`;
    return {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.excerpt,
        type: 'article',
        publishedTime: frontmatter.date,
        tags: frontmatter.tags,
        url,
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.title,
        description: frontmatter.excerpt,
      },
      alternates: { canonical: url },
    };
  }

  const dataArticle = dataArticles.find((a) => a.slug === slug);
  if (dataArticle) {
    const url = `/articles/${slug}`;
    return {
      title: dataArticle.title,
      description: dataArticle.excerpt,
      openGraph: {
        title: dataArticle.title,
        description: dataArticle.excerpt,
        type: 'article',
        publishedTime: dataArticle.date,
        tags: dataArticle.tags,
        url,
      },
      twitter: {
        card: 'summary_large_image',
        title: dataArticle.title,
        description: dataArticle.excerpt,
      },
      alternates: { canonical: url },
    };
  }

  return {};
}

function generateArticleJsonLd(title: string, excerpt: string, date: string, tags: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt,
    datePublished: date,
    author: { '@type': 'Person', name: 'SOLO.X', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'SOLO.X' },
    keywords: tags.join(', '),
    inLanguage: 'zh-CN',
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ── Try MDX file first ──
  const mdxArticle = getArticleBySlug(slug);
  if (mdxArticle) {
    const { content: mdxSource } = await compileMDX({
      source: mdxArticle.content,
      components: mdxComponents,
      options: { parseFrontmatter: false },
    });

    const { frontmatter, readingTime } = mdxArticle;
    const jsonLd = generateArticleJsonLd(frontmatter.title, frontmatter.excerpt, frontmatter.date, frontmatter.tags);

    return (
      <article className="prose-wrap">
        <div className="prose-kicker">{frontmatter.type} · FREE READ</div>
        <h1 className="prose-title">{frontmatter.title}</h1>
        <div className="prose-meta">{frontmatter.date} · {readingTime} min · {frontmatter.tags.join(' / ')}</div>
        <div className="prose">{mdxSource}</div>
        <div className="button-row" style={{ marginTop: '2.5rem' }}>
          <Link href="/articles" className="btn-plain">← 返回文章列表</Link>
          <Link href="/pricing" className="btn-sage">查看会员计划</Link>
        </div>
        <div style={{ marginTop: '3rem' }}><Newsletter /></div>
        {jsonLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        )}
      </article>
    );
  }

  // ── Fallback: render from data.ts ──
  const dataArticle = dataArticles.find((a) => a.slug === slug);
  if (!dataArticle) notFound();

  const jsonLd = generateArticleJsonLd(dataArticle.title, dataArticle.excerpt, dataArticle.date, dataArticle.tags);

  return (
    <article className="prose-wrap">
      <div className="prose-kicker">{dataArticle.type} · {dataArticle.premium ? 'PRO MEMBER' : 'FREE READ'}</div>
      <h1 className="prose-title">{dataArticle.title}</h1>
      <div className="prose-meta">{dataArticle.date} · {dataArticle.read} · {dataArticle.tags.join(' / ')}</div>
      <div className="prose">
        <blockquote>{dataArticle.excerpt}</blockquote>
        {dataArticle.body.map((p, i) => (
          i === 1
            ? <><h2>核心判断</h2><p key={i}>{p}</p></>
            : <p key={i}>{p}</p>
        ))}
        <h2>可执行结论</h2>
        <p>把这篇文章当成一个工具使用：找到一个正在重复发生的问题，写下你当前的判断，提炼一个动作模板，然后在下一次任务中验证它。</p>
        <pre><code>{`task = repeated_problem
model = judgment_pattern(task)
asset = package(model, output='article / tool / course')
ship(asset)`}</code></pre>
      </div>
      <div className="button-row" style={{ marginTop: '2.5rem' }}>
        <Link href="/articles" className="btn-plain">← 返回文章列表</Link>
        <Link href="/pricing" className="btn-sage">查看会员计划</Link>
      </div>
      <div style={{ marginTop: '3rem' }}><Newsletter /></div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
