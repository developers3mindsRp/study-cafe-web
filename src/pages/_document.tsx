import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
       <Head>
      {/* The GTM container snippet used to be duplicated here as an inline <head>
          script as well as in _app.tsx. Both ran on every page load: two dataLayer
          `gtm.start` pushes and two gtm.js script insertions. gtm.js guards against
          initialising the same container twice, so tags did not double-fire, but the
          head copy started a 151 KB download in parallel with the LCP image preload
          before the page had rendered anything. Loading is now owned solely by the
          <Script strategy="afterInteractive"> in _app.tsx. The <noscript> fallback
          below still belongs here — it has no cost for JS-enabled visitors. */}
      {/* AdSense is NOT loaded here — a tag in _document runs on every page.
          It is loaded per-route by <AdSenseLoader /> instead; see @/lib/adPolicy. */}
      </Head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TRZDN6BG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}