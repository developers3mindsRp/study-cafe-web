/**
 * Shared parsers for course text/JSON fields (learn_outcomes, includes_info).
 * Matches logic used on the course detail page.
 */

import { resolveApiAssetUrl } from '@/utils/mediaUrl';

export interface StructuredBonusItem {
  label: string;
  title: string;
  image: string;
  worth: string;
}

/** Parse JSON array or newline-separated text into string list. */
export function parseListField(raw?: string | null): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (typeof item === 'string') return item.trim();
          if (item && typeof item === 'object') {
            const o = item as { title?: string; text?: string; label?: string };
            return String(o.title ?? o.text ?? o.label ?? '').trim();
          }
          return '';
        })
        .filter(Boolean);
    }
  } catch {
    /* not JSON */
  }
  return raw
    .split(/\n|<br\s*\/?>/i)
    .map((s) => s.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
}

function itemToTitleEntry(item: unknown): { title: string } | null {
  if (typeof item === 'string') {
    const title = item.trim();
    return title ? { title } : null;
  }
  if (item && typeof item === 'object') {
    const o = item as { title?: string; text?: string; label?: string };
    const title = String(o.title ?? o.text ?? o.label ?? '').trim();
    return title ? { title } : null;
  }
  return null;
}

function parseTitledListFromJson(parsed: unknown): { title: string }[] | null {
  if (Array.isArray(parsed)) {
    return parsed
      .map(itemToTitleEntry)
      .filter((item): item is { title: string } => item != null);
  }
  if (typeof parsed === 'string') {
    const title = parsed.trim();
    return title ? [{ title }] : [];
  }
  if (parsed && typeof parsed === 'object') {
    const entry = itemToTitleEntry(parsed);
    return entry ? [entry] : [];
  }
  return null;
}

function splitPlainTextToTitledItems(text: string): { title: string }[] {
  const lines = text
    .split(/\n|<br\s*\/?>/i)
    .map((line) => line.replace(/^[\s•\-*]+/, '').trim())
    .filter(Boolean);
  return lines.length > 0
    ? lines.map((title) => ({ title }))
    : [{ title: text.trim() }];
}

/**
 * Course fields like `requirements` and `terms_conditions` may be stored as:
 * - JSON array: `["Item 1", "Item 2"]` or `[{ "title": "Item 1" }]`
 * - JSON string: `"Required internet connection"`
 * - JSON object: `{ "title": "Item 1" }`
 * - Plain text: `Required internet connection`
 * - Multiline / bullet plain text
 */
export function parseTitledListField(raw?: string | null): { title: string }[] {
  if (raw == null) return [];
  const text = typeof raw === 'string' ? raw : String(raw);
  if (!text.trim()) return [];

  try {
    const parsed = JSON.parse(text);
    const fromJson = parseTitledListFromJson(parsed);
    if (fromJson !== null) return fromJson;
  } catch {
    /* not JSON — treat as plain text below */
  }

  return splitPlainTextToTitledItems(text);
}

function formatWorth(val: unknown): string {
  if (val == null || val === '') return '';
  const s = String(val).trim();
  if (/^₹|^rs/i.test(s)) return s;
  const n = Number(String(s).replace(/[^0-9.]/g, ''));
  if (Number.isFinite(n) && n > 0) {
    return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return s;
}

/**
 * includes_info may be:
 * - string[] (membership-style benefit lines) → benefitLines
 * - { title, image, worth }[] (course bonuses) → structuredBonuses
 */
export function parseIncludesInfo(raw?: string | null): {
  benefitLines: string[];
  structuredBonuses: StructuredBonusItem[];
} {
  if (!raw?.trim()) return { benefitLines: [], structuredBonuses: [] };
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { benefitLines: [], structuredBonuses: [] };
    }

    if (parsed.every((item) => typeof item === 'string')) {
      return {
        benefitLines: parsed.map(String).map((s) => s.trim()).filter(Boolean),
        structuredBonuses: [],
      };
    }

    const structuredBonuses: StructuredBonusItem[] = parsed
      .map((item, i) => {
        if (!item || typeof item !== 'object') return null;
        const o = item as {
          label?: string;
          title?: string;
          description?: string;
          image?: string;
          icon?: string;
          worth?: string | number;
        };
        const title = String(o.title ?? o.description ?? '').trim();
        if (!title) return null;
        return {
          label: o.label || `Bonus ${i + 1}`,
          title,
          image: String(o.image ?? o.icon ?? '').trim(),
          worth: formatWorth(o.worth),
        };
      })
      .filter((b): b is StructuredBonusItem => b != null);

    return { benefitLines: [], structuredBonuses };
  } catch {
    return { benefitLines: [], structuredBonuses: [] };
  }
}

/** gallery_images setting: string[] or { image_url | url | image }[] */
export function parseGalleryImages(raw: unknown): string[] {
  if (!raw) return [];
  let list: unknown[] = [];
  if (typeof raw === 'string') {
    try {
      const p = JSON.parse(raw);
      list = Array.isArray(p) ? p : [];
    } catch {
      return raw.trim() ? [raw.trim()] : [];
    }
  } else if (Array.isArray(raw)) {
    list = raw;
  }
  return list
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') {
        const o = item as { image_url?: string; url?: string; image?: string };
        return String(o.image_url ?? o.url ?? o.image ?? '').trim();
      }
      return '';
    })
    .filter(Boolean);
}

export function resolveImageUrl(path?: string | null): string {
  return resolveApiAssetUrl(path);
}
