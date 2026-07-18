import { useEffect, useRef } from 'react';
import { resolveApiAssetUrl } from '@/utils/mediaUrl';
import { activateAdScripts } from '@/lib/siteDisplayAds';
import type { SiteAdsSlot } from '@/types/models.types';

function safeHref(url: string): string | undefined {
  const t = url.trim();
  if (!t) return undefined;
  const lower = t.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('vbscript:')) return undefined;
  return t;
}

type Props = {
  slot?: SiteAdsSlot | null;
  className?: string;
};

/** Raw ad-network markup; scripts are re-created on mount so they execute. */
function AdScriptSlot({ code, className }: { code: string; className: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activateAdScripts(ref.current);
  }, [code]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: code }} />;
}

/** Clickable CMS banner — image-only when no URL. */
export default function SiteAdBanner({ slot, className = '' }: Props) {
  if (slot?.mode === 'script') {
    const code = slot.script?.trim();
    if (!code) return null;
    return <AdScriptSlot code={code} className={className} />;
  }

  const src = resolveApiAssetUrl(slot?.image_url);
  if (!src) return null;
  const href = slot?.link_url ? safeHref(String(slot.link_url)) : undefined;

  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- remote CMS uploads
    <img
      src={src}
      alt=""
      className="rounded-[10px] w-full max-w-full h-auto object-cover"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );

  return (
    <div className={className}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}
