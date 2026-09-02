import React from "react";
import type { PostPurchaseLink, PostPurchaseLinkType } from "@/services/order.service";

/** Per-type icon tile — the label itself is admin-authored, so only the visual cue is fixed here. */
const ICON_STYLES: Record<PostPurchaseLinkType, string> = {
  whatsapp: "bg-[#25D366]",
  zoom: "bg-[#2D8CFF]",
  telegram: "bg-[#29A9EB]",
  link: "bg-[#09339B]",
};

function LinkIcon({ type }: { type: PostPurchaseLinkType }) {
  const glyph = (() => {
    switch (type) {
      case "whatsapp":
        return (
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.16c-.25.69-1.44 1.32-1.99 1.37-.53.05-1.02.24-3.44-.72-2.9-1.14-4.74-4.1-4.88-4.29-.14-.19-1.16-1.55-1.16-2.95 0-1.4.73-2.09.99-2.37.26-.29.57-.36.76-.36l.55.01c.17.01.41-.07.64.49.24.57.81 1.97.88 2.11.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.29.29-.12.57.16.29.72 1.19 1.55 1.93 1.07.95 1.97 1.25 2.25 1.39.29.14.45.12.62-.07.17-.19.71-.83.9-1.12.19-.29.38-.24.64-.14.26.09 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.69-.18 1.38Z" />
        );
      case "zoom":
        return (
          <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h8A1.5 1.5 0 0 1 14 7.5v9A1.5 1.5 0 0 1 12.5 18h-8A1.5 1.5 0 0 1 3 16.5v-9Zm12.5 3.2 4.2-2.9a.75.75 0 0 1 1.3.62v7.16a.75.75 0 0 1-1.3.62l-4.2-2.9v-2.6Z" />
        );
      case "telegram":
        return (
          <path d="M21.7 4.3 2.9 11.5c-.9.35-.9.85-.15 1.08l4.8 1.5 1.85 5.6c.22.6.4.83 1.02.83.48 0 .69-.22.96-.48l2.3-2.24 4.79 3.54c.88.49 1.51.24 1.73-.82l3.13-14.75c.32-1.3-.5-1.9-1.63-1.46Zm-3.5 3.5-8.1 7.34-.32 3.38-1.6-4.9 10.02-5.82Z" />
        );
      default:
        return (
          <path d="M10.6 13.4a1 1 0 0 1 0-1.41l2.83-2.83a3 3 0 1 1 4.24 4.24l-1.4 1.42a1 1 0 1 1-1.42-1.42l1.41-1.41a1 1 0 0 0-1.41-1.42l-2.83 2.83a1 1 0 0 1-1.42 0Zm2.8-2.8a1 1 0 0 1 0 1.41l-2.83 2.83a3 3 0 1 1-4.24-4.24l1.41-1.42a1 1 0 1 1 1.41 1.42L7.74 12a1 1 0 1 0 1.42 1.42l2.83-2.83a1 1 0 0 1 1.41 0Z" />
        );
    }
  })();

  return (
    <span
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${ICON_STYLES[type]}`}
      aria-hidden="true"
    >
      <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
        {glyph}
      </svg>
    </span>
  );
}

/**
 * Join buttons the course sets up for its thank-you page (WhatsApp group, Zoom meeting, …).
 * Renders nothing when the course has none configured.
 */
const PostPurchaseLinks = ({ links }: { links: PostPurchaseLink[] }) => {
  if (!links.length) return null;

  return (
    <div className="w-full md:max-w-[650px] mx-auto mt-8 px-4 md:px-0 space-y-3">
      <h2 className="text-lg md:text-xl font-semibold text-[#1F1F1F]">Next step</h2>
      {links.map((link, index) => (
        <a
          key={`${link.url}-${index}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-[10px] border border-[#E0E0E0] px-4 py-3.5 transition hover:border-[#09339B] hover:bg-[#09339B]/[0.03]"
        >
          <LinkIcon type={link.type} />
          <span className="text-base md:text-lg font-semibold text-[#1F1F1F]">{link.label}</span>
        </a>
      ))}
    </div>
  );
};

export default PostPurchaseLinks;
