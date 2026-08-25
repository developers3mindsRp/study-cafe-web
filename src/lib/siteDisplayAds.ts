import { resolveApiAssetUrl } from '@/utils/mediaUrl';
import type { SiteAdsSlot, SiteDisplayAds } from '@/types/models.types';

/**
 * Marker type parked on CMS ad `<script>` tags so the browser treats them as
 * data instead of running them.
 *
 * In-article ad markup ships inside the server-rendered HTML, and a plain
 * `<script>` in that stream executes while the document is parsed — then
 * `activateAdScripts` re-created it on mount and AdSense ran a second time
 * against the same `<ins>` ("already have ads in them"). Neutralising the tag
 * up front gives one execution path for SSR and client navigation alike:
 * nothing runs until `activateAdScripts` swaps the tag for a live one.
 */
const AD_SCRIPT_TYPE = 'text/x-site-ad';

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

/**
 * Rewrite every `<script>` opening tag in CMS ad markup to the inert type.
 * The original `type` is dropped — ad snippets are always JavaScript, and the
 * activated tag defaults back to that.
 */
export function neutralizeAdScripts(code: string): string {
  return code.replace(/<script\b([^>]*)>/gi, (_full, attrs: string) => {
    const cleaned = attrs.replace(/\stype\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    return `<script${cleaned} type="${AD_SCRIPT_TYPE}">`;
  });
}

/** True when the slot is actually configured for its selected mode. */
export function slotHasContent(slot: SiteAdsSlot | null | undefined): boolean {
  if (!slot) return false;
  if (slot.mode === 'script') return Boolean(slot.script?.trim());
  return Boolean(slot.image_url?.trim());
}

/**
 * Turn the neutralised ad `<script>` tags inside `root` into live ones.
 * Only tags carrying our marker type are touched, so unrelated scripts the CMS
 * embedded in an article body are never re-run. Idempotent via a done-marker.
 */
export function activateAdScripts(root: HTMLElement | null | undefined): void {
  if (!root) return;
  const scripts = Array.from(
    root.querySelectorAll<HTMLScriptElement>(`script[type="${AD_SCRIPT_TYPE}"]`),
  );
  for (const old of scripts) {
    if (old.dataset.adActivated === '1') continue;
    const fresh = document.createElement('script');
    for (const attr of Array.from(old.attributes)) {
      fresh.setAttribute(attr.name, attr.value);
    }
    fresh.removeAttribute('type');
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
    return `<div class="site-ad-slot site-ad-script my-6 text-center">${neutralizeAdScripts(code)}</div>`;
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

/**
 * Offsets just past each paragraph end, as two lists.
 *
 * `strict` counts only paragraphs at the outermost level: not in a table, so a
 * banner never lands in a data cell, and not inside a `<div>` — which is what
 * the "Also Read" blocks are, complete with their own `<p class="related-heading">`.
 * Counting those put a banner between the heading and its link.
 *
 * `loose` ignores `<div>` nesting and is the fallback for a body whose whole
 * content sits inside a wrapper div, where `strict` would find nothing and the
 * article would silently lose its ads.
 *
 * Scanned as a string rather than through DOMParser because the result has to
 * be identical on the server and in the browser (see below).
 */
function paragraphEnds(html: string): { strict: number[]; loose: number[] } {
  const re = /<table\b|<\/table\s*>|<div\b|<\/div\s*>|<\/p\s*>/gi;
  const strict: number[] = [];
  const loose: number[] = [];
  let tableDepth = 0;
  let divDepth = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const tag = match[0].toLowerCase();
    if (tag.startsWith('<table')) tableDepth += 1;
    else if (tag.startsWith('</table')) tableDepth = Math.max(0, tableDepth - 1);
    else if (tag.startsWith('<div')) divDepth += 1;
    else if (tag.startsWith('</div')) divDepth = Math.max(0, divDepth - 1);
    else if (tableDepth === 0) {
      const end = match.index + match[0].length;
      loose.push(end);
      if (divDepth === 0) strict.push(end);
    }
  }
  return { strict, loose };
}

/**
 * Inject in-article banners after the configured paragraphs.
 *
 * Runs on the server as well as the client, and must: the body is handed to
 * React through `dangerouslySetInnerHTML`, and React never rewrites that
 * content during hydration. A browser-only version (the DOMParser one this
 * replaced) therefore produced ad-free server HTML that the client kept
 * forever — the banners only reappeared if something else changed the body,
 * such as the premium-unlock refetch, which is why paying members saw them and
 * ordinary readers did not.
 *
 * Takes the `between_article` slots straight from the CMS and turns each into
 * markup via `bannerSnippetFromSlot` — passing the slots object to `innerHTML`
 * is what rendered a literal "[object Object]" mid-article.
 */
export function injectBetweenArticleAdsIntoHtml(
  html: string,
  between: SiteDisplayAds['between_article'] | null | undefined,
): string {
  if (!html || !between) return html;

  const rows = [
    { after: 6, snippet: bannerSnippetFromSlot(between.after_paragraph_6) },
    { after: 3, snippet: bannerSnippetFromSlot(between.after_paragraph_3) },
  ].filter((row): row is { after: number; snippet: string } => Boolean(row.snippet));

  if (rows.length === 0) return html;

  const { strict, loose } = paragraphEnds(html);
  const seen = new Set<number>();
  const inserts = rows
    .map((row) => ({ at: strict[row.after - 1] ?? loose[row.after - 1], snippet: row.snippet }))
    .filter((row) => {
      // A short article can resolve both slots to the same paragraph; one
      // banner there is the intent, not two stacked.
      if (row.at == null || seen.has(row.at)) return false;
      seen.add(row.at);
      return true;
    })
    // Latest offset first, so each splice leaves the earlier offsets valid.
    .sort((a, b) => b.at - a.at);

  let out = html;
  for (const { at, snippet } of inserts) {
    out = `${out.slice(0, at)}${snippet}${out.slice(at)}`;
  }
  return out;
}
