/** Strip HTML to a single plain line (matches server `stripTags` behaviour). */
export function stripHtml(text: string | null | undefined): string {
  return String(text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Remove legacy related shortcodes and resolved "Also read" blocks before stripping tags. */
export function stripRelatedArticleHtml(html: string | null | undefined): string {
  return String(html || "")
    .replace(/\[related\s+id=['"]\d+['"]\]/gi, " ")
    .replace(/<div[^>]*related-article-inline[^>]*>[\s\S]*?<\/div>/gi, " ");
}

/** Plain text: drop related shortcodes and "Also read" labels (after `stripHtml`). */
export function sanitizeTeaserPlain(s: string | null | undefined): string {
  return String(s || "")
    .replace(/\[related\s+id=['"]\d+['"]\]/gi, " ")
    .replace(/\bAlso\s+Read\b[:\s]*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const MIN_PROPER_DESC_LEN = 60;
/** When there is no excerpt/meta/sub blurb, use this many characters from body (100–150 range). */
const BODY_SNIPPET_LEN = 150;

/**
 * First ~150 chars of article HTML as plain text — no "Also read" / related blocks.
 */
export function bodySnippetPlain(html: string | null | undefined, maxLen = BODY_SNIPPET_LEN): string {
  const raw = stripRelatedArticleHtml(html);
  const plain = sanitizeTeaserPlain(stripHtml(raw));
  if (!plain) return "";
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen - 1)}…`;
}

type TeaserFields = {
  title?: string | null;
  excerpt?: string | null;
  sub_heading?: string | null;
  meta_description?: string | null;
  body?: string | null;
};

/**
 * Plain-text hero / card teaser: excerpt + sub_heading + meta when that is substantive;
 * otherwise **only** a short body snippet (~150 chars), excluding related / "Also read" noise.
 */
export function articleTeaserPlain(fields: TeaserFields, maxLen = 560): string {
  const title = stripHtml(fields.title || "").toLowerCase();
  const neTitle = (s: string | null | undefined) => {
    const t = stripHtml(s).replace(/\s+/g, " ").trim();
    if (!t) return "";
    if (t.toLowerCase() === title) return "";
    return t;
  };

  let ex = neTitle(fields.excerpt);
  const sub = neTitle(fields.sub_heading);
  const meta = neTitle(fields.meta_description);

  let text = ex;
  if (ex.length < 80) {
    text = [ex, sub, meta].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  }
  text = sanitizeTeaserPlain(text);

  if (!text || text.length < MIN_PROPER_DESC_LEN) {
    const snip = bodySnippetPlain(fields.body, BODY_SNIPPET_LEN);
    if (snip) return snip;
    return text.length > 0 ? (text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text) : "";
  }

  if (text.length > maxLen) return `${text.slice(0, maxLen - 1)}…`;
  return text;
}
