import { useEffect } from "react";
import { getPublicTrackingSettings } from "@/services/platform.service";

const MOUNT_MARK = "data-sc-marketing-scripts";

let injectionPromise: Promise<void> | null = null;

/** Pasted HTML from Admin → Global Settings: scripts, meta, link → head (except noscript → body). */
function injectHtmlFragments(fragments: string[]) {
  for (const raw of fragments) {
    const html = raw?.trim();
    if (!html) continue;

    const wrapped = `<!DOCTYPE html><html><body>${html}</body></html>`;
    const parsed = new DOMParser().parseFromString(wrapped, "text/html");

    for (const node of Array.from(parsed.body.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!(node.textContent?.trim())) continue;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      const el = node as Element;
      const clone = document.importNode(node, true);
      if (el.tagName === "NOSCRIPT") {
        document.body.appendChild(clone);
      } else {
        document.head.appendChild(clone);
      }
    }
  }
}

function ensureMarketingInjected(): Promise<void> {
  if (injectionPromise) return injectionPromise;

  injectionPromise = (async () => {
    if (typeof document === "undefined") return;
    if (document.documentElement.getAttribute(MOUNT_MARK) === "1") return;

    const s = await getPublicTrackingSettings();
    injectHtmlFragments([
      s.tracking_google_analytics ?? "",
      s.tracking_meta_pixel ?? "",
      s.tracking_linkedin_pixel ?? "",
    ]);
    document.documentElement.setAttribute(MOUNT_MARK, "1");
  })().catch(() => {
    /** Non-blocking: storefront works without telemetry */
  });

  return injectionPromise;
}

export default function MarketingTrackingInjector() {
  useEffect(() => {
    void ensureMarketingInjected();
  }, []);

  return null;
}
