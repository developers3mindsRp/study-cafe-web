import type { ProgressSessionRow } from "@/services/progress.service";

/** In-memory oEmbed results (Vimeo is public CDN URLs). */
const thumbnailByVideoId = new Map<string, string>();

export function parseVimeoIdFromUrl(url: string): string | null {
  const u = String(url).trim();
  if (!u) return null;
  if (/^\d+$/.test(u)) return u;
  const m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return m ? m[1] : null;
}

/**
 * First Vimeo numeric id from this session’s recordings (any non-empty URL).
 */
export function firstVimeoIdFromSession(s: ProgressSessionRow): string | null {
  const recs = (s.recordings ?? []).filter((r) => r?.url && String(r.url).trim() !== "");
  for (const r of recs) {
    const id = parseVimeoIdFromUrl(r.url);
    if (id) return id;
  }
  return null;
}

/**
 * Resolve thumbnail image URL from Vimeo oEmbed (no API key).
 * Returns null if the request fails or the video is private / unavailable.
 */
export async function fetchVimeoThumbnailByVideoId(videoId: string): Promise<string | null> {
  const cached = thumbnailByVideoId.get(videoId);
  if (cached) return cached;
  try {
    const oembed = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
      `https://vimeo.com/${videoId}`
    )}&width=320`;
    const res = await fetch(oembed);
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: string };
    const thumb = data?.thumbnail_url;
    if (typeof thumb === "string" && thumb.startsWith("http")) {
      thumbnailByVideoId.set(videoId, thumb);
      return thumb;
    }
  } catch {
    return null;
  }
  return null;
}

export async function prefetchVimeoThumbnails(
  videoIds: string[]
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const unique = Array.from(new Set(videoIds.filter(Boolean)));
  await Promise.all(
    unique.map(async (id) => {
      const url = await fetchVimeoThumbnailByVideoId(id);
      if (url) out[id] = url;
    })
  );
  return out;
}
