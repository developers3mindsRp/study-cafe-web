import { resolveApiAssetUrl } from '@/utils/mediaUrl';
import type { SiteAdsSlot, SiteDisplayAds } from '@/types/models.types';

function safeHref(url: string): string {
  const t = url.trim();
  if (!t) return '#';
  const lower = t.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return '#';
  return t;
}

function escapeHtmlAttr(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

/** Server-safe HTML snippet for one banner (injected next to raw article HTML). */
export function bannerSnippetFromSlot(slot: SiteAdsSlot | undefined): string | null {
  const srcRaw = slot?.image_url?.trim();
  if (!srcRaw) return null;
  const resolved = resolveApiAssetUrl(srcRaw);
  const img = `<img src="${escapeHtmlAttr(resolved)}" alt="" class="max-w-full h-auto  rounded-[10px] block mx-auto" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
  const link = slot?.link_url?.trim();
  const href = link ? safeHref(link) : '';
  if (href && href !== '#') {
    return `<div class="site-ad-slot my-6 text-center"><a href="${escapeHtmlAttr(href)}" target="_blank" rel="noopener noreferrer">${img}</a></div>`;
  }
  return `<div class="site-ad-slot my-6 text-center">${img}</div>`;
}

function insertAfterNthClosingPTag(html: string, n: number, insertion: string): string {
  if (n < 1 || !insertion || !html) return html;
  const re = /<\/p>/gi;
  let count = 0;
  let match: RegExpExecArray | null;
  let insertAt = -1;
  while ((match = re.exec(html)) !== null) {
    count += 1;
    if (count === n) {
      insertAt = match.index + match[0].length;
      break;
    }
  }
  if (insertAt < 0) return html;
  return `${html.slice(0, insertAt)}${insertion}${html.slice(insertAt)}`;
}

/**
 * Inject in-article banners after the Nth paragraph (tracked by literal `</p>` tags).
 * Inserts larger paragraph index first so earlier indices stay stable.
 */
export function injectBetweenArticleAdsIntoHtml(
  html: string,
  between: SiteDisplayAds['between_article'] | undefined,
): string {
  if (!between || !html) return html;

  type Row = { n: number; html: string | null };
  const rows: Row[] = [
    { n: 6, html: bannerSnippetFromSlot(between.after_paragraph_6) },
    { n: 3, html: bannerSnippetFromSlot(between.after_paragraph_3) },
  ];

  let out = html;
  for (const { n, html: snippet } of rows) {
    if (!snippet) continue;
    out = insertAfterNthClosingPTag(out, n, snippet);
  }
  return out;
}
