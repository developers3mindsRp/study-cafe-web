import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import CertificateArtwork, { type CertificateArtworkProps } from "./CertificateArtwork";
import { CERTIFICATE_HEIGHT, CERTIFICATE_WIDTH } from "@/lib/certificateImage";

type CertificateLayoutProps = CertificateArtworkProps;

// useLayoutEffect warns during SSR; on the client it measures before paint so there is no flash
// of an unscaled, clipped certificate.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * On-screen PREVIEW of the certificate: the real 822×583 artwork scaled down to fit whatever width
 * its container gives it (never scaled up).
 *
 * The scale is measured, not picked per breakpoint. Fixed `scale-*` steps clipped the edges
 * whenever the container was narrower than the step assumed — e.g. `md:scale-100` inside the
 * ~700px card on /certificate/[token] cut off the serial number and the right-hand border.
 *
 * Do not capture from this element. The transform is what a screenshot library sees, so a capture
 * taken here comes out shrunk. Use useCertificateDownload(), which renders CertificateArtwork
 * off-screen at full size.
 */
const CertificateLayout: React.FC<CertificateLayoutProps> = (props) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useIsomorphicLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const fit = () => {
      const available = frame.clientWidth;
      if (available > 0) setScale(Math.min(1, available / CERTIFICATE_WIDTH));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="w-full py-4">
      {/* Sized to the SCALED artwork so the page reserves exactly the space it occupies. */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{ width: CERTIFICATE_WIDTH * scale, height: CERTIFICATE_HEIGHT * scale }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: CERTIFICATE_WIDTH,
            height: CERTIFICATE_HEIGHT,
            transform: `scale(${scale})`,
          }}
        >
          <CertificateArtwork {...props} />
        </div>
      </div>
    </div>
  );
};

export default CertificateLayout;
