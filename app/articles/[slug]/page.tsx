import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import { getArticleBySlug, getAllSlugs } from '@/lib/articles';
import { mdxComponents } from '@/lib/mdx';
import { SITE_URL } from '@/lib/constants';
import { SubscribeForm } from '@/components/subscribe-form';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const { frontmatter } = article;
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
    alternates: {
      canonical: url,
    },
  };
}

function generateArticleJsonLd(article: ReturnType<typeof getArticleBySlug>) {
  if (!article) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.frontmatter.title,
    description: article.frontmatter.excerpt,
    datePublished: article.frontmatter.date,
    author: {
      '@type': 'Person',
      name: 'SOLO.X',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'SOLO.X',
    },
    keywords: article.frontmatter.tags.join(', '),
    inLanguage: 'zh-CN',
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { content } = await compileMDX({
    source: article.content,
    components: mdxComponents,
    options: { parseFrontmatter: false },
  });

  const jsonLd = generateArticleJsonLd(article);

  return (
    <article className="article-detail">
      <header>
        <h1>{article.frontmatter.title}</h1>
        <div className="article-meta">
          <time>{article.frontmatter.date}</time>
          <span>{article.readingTime} 分钟</span>
          {article.frontmatter.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </header>
      <div className="article-body">{content}</div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <SubscribeForm source="article" />
    </article>
  );
}
