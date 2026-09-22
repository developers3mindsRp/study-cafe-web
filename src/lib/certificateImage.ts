import * as htmlToImage from "html-to-image";

/** True pixel size of CertificateArtwork. Pinned so a capture never depends on layout width. */
export const CERTIFICATE_WIDTH = 822;
export const CERTIFICATE_HEIGHT = 583;

/** 3× gives a 2466×1749 PNG — sharp enough to print. */
const PIXEL_RATIO = 3;

/**
 * next/font loads lazily, so `document.fonts.ready` can resolve before a weight the certificate
 * uses has actually been fetched. Ask for each one explicitly.
 */
const FONT_SPECS = ["400 16px Outfit", "500 35px Outfit", "600 18px Outfit"];

async function waitForFonts(): Promise<void> {
  try {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fonts) return;
    await fonts.ready;
    await Promise.allSettled(FONT_SPECS.map((spec) => fonts.load(spec)));
  } catch {
    // A browser without the CSS Font Loading API still renders; it just may fall back.
  }
}

/**
 * html-to-image inlines images as they are at capture time. An <img> that has not finished
 * decoding rasterizes blank, which is the usual cause of a half-drawn certificate.
 */
async function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.allSettled(
    images.map(async (img) => {
      if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        });
      }
      await img.decode?.();
    }),
  );
}

/**
 * The off-screen host must be an ANCESTOR of the captured node, never the node itself: its
 * `position: fixed; left: -10000px` gets copied onto the clone and pushes the render off the
 * canvas, producing a blank PNG with no error. The style override above neutralises the offsets,
 * but pointing the ref at a plain wrapper is the real fix — so say so loudly in development.
 */
function warnIfNodeIsOffScreenPositioned(node: HTMLElement): void {
  if (process.env.NODE_ENV === "production") return;
  try {
    const { position, left } = window.getComputedStyle(node);
    const offset = parseFloat(left);
    if (position !== "static" && Number.isFinite(offset) && offset < -1000) {
      console.warn(
        "[certificate] capture node is itself positioned off-screen (position: " +
          position +
          ", left: " +
          left +
          "). Attach the ref to an unpositioned wrapper INSIDE the off-screen host instead.",
      );
    }
  } catch {
    // getComputedStyle can throw on a detached node; the capture itself will report the failure.
  }
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Capture the certificate artwork as a PNG data URL.
 *
 * `node` must be the unscaled CertificateArtwork element — see CertificateLayout for why the
 * on-screen preview is the wrong thing to pass.
 *
 * Deliberately NOT using `cacheBust: true`: it appends a query string to every asset, which forces
 * a re-fetch during the capture and causes exactly the blank images it was meant to prevent. All
 * five assets are same-origin and already cached.
 */
export async function captureCertificatePng(node: HTMLElement): Promise<string> {
  warnIfNodeIsOffScreenPositioned(node);
  await waitForFonts();
  await waitForImages(node);

  // Two frames so layout and style recalculation have both flushed.
  await nextFrame();
  await nextFrame();

  const options = {
    pixelRatio: PIXEL_RATIO,
    width: CERTIFICATE_WIDTH,
    height: CERTIFICATE_HEIGHT,
    backgroundColor: "#ffffff",
    style: {
      transform: "none",
      transformOrigin: "top left",
      margin: "0",
      // Neutralise positional offsets. html-to-image copies the node's full computed cssText
      // onto its clone and drops that clone into a <foreignObject> at the origin, so a node
      // carrying `left: -10000px` from an off-screen host renders outside the canvas and the
      // PNG comes out blank white. `auto` is the initial value, so this is a no-op for a node
      // that sets no offsets of its own.
      left: "auto",
      top: "auto",
      right: "auto",
      bottom: "auto",
    },
  };

  // html-to-image routinely drops webfonts on its first run in a page. Throw the first capture
  // away and keep the second — the standard mitigation, and cheap at this size.
  await htmlToImage.toPng(node, options);
  return htmlToImage.toPng(node, options);
}

/**
 * Hand the PNG to the user.
 *
 * The ReactNativeWebView branch is a contract with the mobile app: it listens for exactly
 * { type: "DOWNLOAD_CERTIFICATE", image } and saves the base64 itself, because an <a download>
 * does nothing inside the WebView. Do not rename or restructure that message.
 */
export function triggerCertificateDownload(dataUrl: string, filename = "certificate.png"): void {
  const rnWebView = (window as unknown as { ReactNativeWebView?: { postMessage: (msg: string) => void } })
    .ReactNativeWebView;

  if (rnWebView) {
    rnWebView.postMessage(
      JSON.stringify({
        type: "DOWNLOAD_CERTIFICATE",
        image: dataUrl,
      }),
    );
    return;
  }

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
