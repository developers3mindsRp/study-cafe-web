/** Fixed locale so SSR (Node) and the browser emit the same string — avoids hydration mismatches. */
const DOWNLOAD_DATE_LOCALE = 'en-US';

export function formatDownloadDateLong(iso?: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat(DOWNLOAD_DATE_LOCALE, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return '—';
  }
}

export function formatDownloadDateShort(iso?: string | null): string {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat(DOWNLOAD_DATE_LOCALE, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return '—';
  }
}

/** Route segment for file detail page (slug preferred, else numeric id). */
export function downloadFileHref(slug: string | null | undefined, id: number): string {
  const seg =
    slug != null && String(slug).trim() !== ''
      ? encodeURIComponent(String(slug).trim())
      : String(id);
  return `/file/${seg}`;
}
