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

/** True when the slot is actually configured for its selected mode. */
export function slotHasContent(slot: SiteAdsSlot | null | undefined): boolean {
  if (!slot) return false;
  if (slot.mode === 'script') return Boolean(slot.script?.trim());
  return Boolean(slot.image_url?.trim());
}

/**
 * Re-create every `<script>` inside `root` so the browser executes it.
 * Scripts arriving through innerHTML / dangerouslySetInnerHTML are inert,
 * which is how CMS ad code reaches the page. Idempotent via a done-marker.
 */
export function activateAdScripts(root: HTMLElement | null | undefined): void {
  if (!root) return;
  const scripts = Array.from(root.querySelectorAll('script'));
  for (const old of scripts) {
    if (old.dataset.adActivated === '1') continue;
    const fresh = document.createElement('script');
    for (const attr of Array.from(old.attributes)) {
      fresh.setAttribute(attr.name, attr.value);
    }
    fresh.dataset.adActivated = '1';
    fresh.text = old.text;
    old.replaceWith(fresh);
  }
}

/** Server-safe HTML snippet for one banner (injected next to raw article HTML). */
export function bannerSnippetFromSlot(slot: SiteAdsSlot | undefined): string | null {
  if (slot?.mode === 'script') {
    const code = slot.script?.trim();
    if (!code) return null;
    return `<div class="site-ad-slot site-ad-script my-6 text-center">${code}</div>`;
  }

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
 * Inject in-article banners after the configured paragraphs.
 *
 * Takes the `between_article` slots straight from the CMS and turns each into
 * markup via `bannerSnippetFromSlot` — passing the slots object to `innerHTML`
 * is what rendered a literal "[object Object]" mid-article.
 *
 * Paragraphs inside tables are skipped so a banner never lands in a data cell,
 * which is why this walks the DOM rather than counting `</p>` tags. DOMParser
 * is browser-only, hence the SSR bail-out.
 */
export function injectBetweenArticleAdsIntoHtml(
  html: string,
  between: SiteDisplayAds['between_article'] | null | undefined,
): string {
  if (!html || !between) return html;
  if (typeof window === 'undefined') return html;

  // Later paragraph first: both targets are resolved from the pre-insertion
  // list, so order only matters for readability, not correctness.
  const rows = [
    { after: 6, snippet: bannerSnippetFromSlot(between.after_paragraph_6) },
    { after: 3, snippet: bannerSnippetFromSlot(between.after_paragraph_3) },
  ].filter((row): row is { after: number; snippet: string } => Boolean(row.snippet));

  if (rows.length === 0) return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const paragraphs = Array.from(doc.querySelectorAll('p')).filter(
    (p) => !p.closest('table'),
  );

  let injected = false;
  for (const { after, snippet } of rows) {
    const target = paragraphs[after - 1];
    if (!target) continue;
    const container = doc.createElement('div');
    container.innerHTML = snippet;
    target.after(container);
    injected = true;
  }

  return injected ? doc.body.innerHTML : html;
}
