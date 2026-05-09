import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="article-h1" {...props} />,
  h2: (props) => <h2 className="article-h2" {...props} />,
  h3: (props) => <h3 className="article-h3" {...props} />,
  p: (props) => <p className="article-p" {...props} />,
  a: (props) => <a className="article-link" target="_blank" rel="noopener noreferrer" {...props} />,
  ul: (props) => <ul className="article-ul" {...props} />,
  ol: (props) => <ol className="article-ol" {...props} />,
  li: (props) => <li className="article-li" {...props} />,
  blockquote: (props) => <blockquote className="article-blockquote" {...props} />,
  pre: (props) => <pre className="article-pre" {...props} />,
  code: (props) => <code className="article-code" {...props} />,
  img: (props) => <img className="article-img" loading="lazy" {...props} />,
};
