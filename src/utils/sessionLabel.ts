import type { ProgressSessionRow } from "@/services/progress.service";

/**
 * Label for sidebar / headings: legacy single section/day → "Day N";
 * multiple sections → "Day N · Section M" or custom section title.
 */
export function sessionListLabel(
  s: ProgressSessionRow,
  peersSameDay: ProgressSessionRow[]
): string {
  const custom = s.sectionTitle?.trim();
  if (custom) return custom;

  const only = peersSameDay.length === 1;
  if (only && s.sectionIndex === 0) {
    return `Day ${s.dayNumber}`;
  }

  return `Day ${s.dayNumber} · Section ${s.sectionIndex + 1}`;
}

/**
 * Heading for a day group: "Day N", unless the day holds a single session
 * with a custom section title, in which case that title stands in.
 */
export function dayHeadingLabel(
  day: number,
  daySessions: ProgressSessionRow[]
): string {
  if (daySessions.length === 1) {
    const custom = daySessions[0].sectionTitle?.trim();
    if (custom) return custom;
  }

  return `Day ${day}`;
}
