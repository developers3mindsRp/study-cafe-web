import { useCallback, useRef, useState } from "react";
import { captureCertificatePng, triggerCertificateDownload } from "@/lib/certificateImage";

interface UseCertificateDownloadResult {
  /** Attach to the off-screen host that renders <CertificateArtwork /> at full size. */
  captureRef: React.RefObject<HTMLDivElement>;
  download: (filename?: string) => Promise<void>;
  isDownloading: boolean;
  error: string | null;
}

/**
 * Download plumbing for the certificate, shared by the learner modal and the public claim page.
 *
 * The consumer renders a permanently-mounted host holding the full-size artwork. Note where the
 * ref goes — on the INNER div, not the positioned host:
 *
 *   <div aria-hidden
 *        style={{ position: "fixed", left: -10000, top: 0, width: 822, height: 583,
 *                 pointerEvents: "none", zIndex: -1 }}>
 *     <div ref={captureRef}>
 *       <CertificateArtwork {...fields} />
 *     </div>
 *   </div>
 *
 * Three rules for that host, all learned the hard way:
 *
 *  1. Never hide it with `display:none`, `visibility:hidden` or `opacity:0`. A hidden subtree has
 *     no layout, so it rasterizes blank. Positioning it off-screen is the only safe way to keep it
 *     out of sight and still capturable.
 *  2. Never put the ref on the positioned host itself. html-to-image copies the captured node's
 *     full computed cssText onto its clone and renders that clone in a <foreignObject> at the
 *     origin — so `left: -10000px` comes along for the ride and the PNG is blank white, with no
 *     error anywhere. The ref belongs on a plain, unpositioned wrapper inside the host.
 *  3. Keep it mounted in the normal React tree rather than rendering into a detached div with
 *     createRoot — a second React root brings its own hydration problems in the Pages Router.
 */
export function useCertificateDownload(): UseCertificateDownloadResult {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (filename = "certificate.png") => {
    const node = captureRef.current;
    if (!node) return;

    setIsDownloading(true);
    setError(null);
    try {
      const dataUrl = await captureCertificatePng(node);
      triggerCertificateDownload(dataUrl, filename);
    } catch (err) {
      console.error("[certificate] download failed", err);
      setError("Could not generate the certificate image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { captureRef, download, isDownloading, error };
}
