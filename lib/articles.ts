import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article, ArticleFrontmatter, ArticleType } from '@/types/article';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx'));

  const articles = files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);

    return {
      slug,
      frontmatter: data as ArticleFrontmatter,
      content,
      readingTime: calculateReadingTime(content),
    };
  });

  return articles
    .filter(a => !a.frontmatter.draft)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find(a => a.slug === slug);
}

export function getArticlesByType(type: ArticleType | 'all'): Article[] {
  const articles = getAllArticles();
  if (type === 'all') return articles;
  return articles.filter(a => a.frontmatter.type === type);
}

export function getAllTags(): string[] {
  const articles = getAllArticles();
  const tags = new Set<string>();
  articles.forEach(a => a.frontmatter.tags?.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

export function getAllSlugs(): string[] {
  return getAllArticles().map(a => a.slug);
}

function calculateReadingTime(content: string): number {
  const chineseChars = (content.match(/[一-鿿]/g) || []).length;
  const englishWords = content.replace(/[一-鿿]/g, '').split(/\s+/).filter(Boolean).length;
  const totalMinutes = chineseChars / 400 + englishWords / 200;
  return Math.max(1, Math.ceil(totalMinutes));
}
