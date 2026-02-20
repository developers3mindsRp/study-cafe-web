'use client';

import type { RelatedArticle } from '@/types/models.types';

const RELATED_SHORTCODE_REGEX = /\[related\s+id="(\d+)"\]/gi;

interface ArticleBodyProps {
  /** Article body (HTML or TipTap JSON string). Legacy content may contain [related id="123"]. */
  body: string;
  /** Resolved from [related id="..."] shortcodes (returned by API). */
  relatedArticles?: RelatedArticle[];
  /** Base URL for article links (e.g. "" for relative "/blogs/slug"). */
  articleUrlBase?: string;
  className?: string;
}

/**
 * Renders article body. When body contains legacy [related id="123"] shortcodes
 * and relatedArticles is provided, replaces them with "Also Read: title (link)".
 * Otherwise renders body as HTML (or plain text if not HTML).
 */
export default function ArticleBody({
  body,
  relatedArticles = [],
  articleUrlBase = '',
  className = '',
}: ArticleBodyProps) {
  if (!body?.trim()) return null;

  RELATED_SHORTCODE_REGEX.lastIndex = 0;
  const hasShortcode = RELATED_SHORTCODE_REGEX.test(body);
  RELATED_SHORTCODE_REGEX.lastIndex = 0;

  if (!hasShortcode) {
    return (
      <div
        className={`prose prose-sm max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }

  const mapById = new Map(relatedArticles.map((a) => [a.id, a]));
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  RELATED_SHORTCODE_REGEX.lastIndex = 0;

  while (true) {
    const m = RELATED_SHORTCODE_REGEX.exec(body);
    if (!m) break;
    const id = parseInt(m[1], 10);
    const before = body.slice(lastIndex, m.index);
    if (before) {
      parts.push(
        <div
          key={`html-${key++}`}
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: before }}
        />
      );
    }
    const article = mapById.get(id);
    const href = articleUrlBase
      ? `${articleUrlBase}/blogs/${article?.slug ?? id}`
      : `/blogs/${article?.slug ?? id}`;
    parts.push(
      <div
        key={`related-${key++}`}
        className="my-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4"
      >
        <div className="flex items-start gap-2">
          <span className="shrink-0 font-semibold text-blue-700">
            Also Read:
          </span>
          <a
            href={href}
            className="font-medium text-blue-600 underline hover:text-blue-800"
          >
            {article?.title ?? `Article #${id}`}
          </a>
        </div>
      </div>
    );
    lastIndex = RELATED_SHORTCODE_REGEX.lastIndex;
  }

  const tail = body.slice(lastIndex);
  if (tail) {
    parts.push(
      <div
        key={`html-${key++}`}
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: tail }}
      />
    );
  }

  return <div className={className}>{parts}</div>;
}
