import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { Outfit } from "next/font/google";
import { useState } from "react";
import {
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient as defaultQueryClient } from "@/lib/react-query";
import { AuthProvider } from "@/providers/AuthProvider";
import { AppRouteSeo } from "@/components/seo/AppRouteSeo";
import MarketingTrackingInjector from "@/components/marketing/MarketingTrackingInjector";
import AdSenseLoader from "@/components/ads/AdSenseLoader";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => defaultQueryClient);

  return (
    <>
      <Head>
        {/* The CMS serves every hero/thumbnail image from this origin, including the
            homepage LCP image, which next/head preloads. Without the preconnect that
            preload still had to pay DNS + TCP + TLS to a cold origin before a single
            byte arrived. Listed first so it wins the browser's early-connection budget
            over the analytics origins below. */}
        <link rel="preconnect" href="https://assets.studycafe.in" />
        {/* No preconnect for www.googletagmanager.com or connect.facebook.net: both are
            lazyOnload, so a warmed connection would have gone idle and been dropped
            before it was used, while still competing for the early-connection budget
            that the LCP image above needs. */}
      </Head>
      
      {/* ==================== Google Tag Manager ====================
          This is the ONLY place GTM is loaded. An identical inline copy used to sit in
          _document.tsx's <head>; it was removed so the container is not initialised
          twice and so its 151 KB download no longer races the LCP image.

          lazyOnload, not afterInteractive. This one snippet pulls 537 KB across three
          requests — the container, a gtag destination, and a first-party tag script —
          and it was the last tag still contending with hydration, blocking the main
          thread for 672 ms of a measured 1,070 ms third-party total. The homepage LCP
          is gated on an ~11s render delay that is main-thread contention, not bytes.

          The tradeoff is deliberate and it is a real one: tags now fire during idle
          time after window load rather than shortly after hydration, so a visitor who
          leaves very quickly may not be counted. Pageviews and Google Ads conversions
          still fire for everyone else. Revert to afterInteractive if attribution
          regresses by more than the speed is worth. */}
      <Script id="gtm" strategy="lazyOnload">
        {`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({
              'gtm.start': new Date().getTime(),
              event:'gtm.js'
            });
            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TRZDN6BG');
        `}
      </Script>

      {/* ==================== Google Analytics ====================
          The Universal Analytics property UA-26881622-1 was loaded here (gtag/js, 131 KB
          on every page load). Google stopped processing hits to standard UA properties on
          1 July 2023, so the tag had been sending data nowhere for over two years. Removed
          — nothing in the app called `gtag()`. Reporting is GA4 via the GTM container. */}

     {/* ==================== Facebook Pixel ====================
         lazyOnload, not afterInteractive: fbevents.js is 109 KB and nothing in the app
         reads `fbq` (verified by grep), so it has no reason to compete with hydration.
         PageView still fires on every load, just during browser idle time. */}
        <Script id="facebook-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;

              n=f.fbq=function(){
                n.callMethod ?
                n.callMethod.apply(n,arguments) :
                n.queue.push(arguments);
              };

              if(!f._fbq)f._fbq=n;

              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];

              t=b.createElement(e);
              t.async=!0;
              t.src=v;

              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s);

            }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

            // Meta Pixel (old pixel 280305326909957 retired — keep only this one)
            fbq('init', '1022628013882852');
            fbq('track', 'PageView');
          `}
        </Script>

      {/* ==================== WebTrafficSource ==================== */}
      <Script id="webtrafficsource" strategy="lazyOnload">
        {`
          (function(){
            var s=document.createElement("script");
            s.async=true;
            s.src=(document.location.protocol==="https:"?"https:":"http:")+"//webtrafficsource.com/track/code.js";
            var a=document.getElementsByTagName("script")[0];
            a.parentNode.insertBefore(s,a);
          })();
        `}
      </Script>

      {/* ==================== External Scripts ====================
          Retargeting pixels. Downgraded from afterInteractive to lazyOnload — they only
          need to fire once per visit and have no bearing on what the page renders, so
          they should not be contending for the main thread while React hydrates. */}

      <Script
        src="https://rtb-global.com/rtbv2.js"
        strategy="lazyOnload"
      />

      <Script
        src="https://wd-ret.io/rtg/v1/retag.js"
        strategy="lazyOnload"
      />

      <Script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        strategy="lazyOnload"
      />

      {/* ==================== OneSignal ==================== */}
      <Script id="onesignal-init" strategy="lazyOnload">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];

          OneSignalDeferred.push(function(OneSignal){
            OneSignal.init({
              appId:"a58930c3-a637-41aa-9678-48448e9b4e5f",
              safari_web_id:"web.onesignal.auto.08e72fe8-7d9e-49e9-8aad-204d649fdf9c",
              notifyButton:{
                enable:true
              }
            });
          });
        `}
      </Script>

      {/* ==================== GTM NoScript ==================== */}
    

     {/* ==================== Facebook Pixel NoScript ==================== */}
      <noscript>
        <>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1022628013882852&ev=PageView&noscript=1"
            alt=""
          />
        </>
      </noscript>

      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <AuthProvider>
            <MarketingTrackingInjector />
            <AdSenseLoader />

            <AppRouteSeo
              ssrSeo={pageProps.pageSeo ?? null}
              ssrPathname={
                typeof pageProps.seoPathname === "string"
                  ? pageProps.seoPathname
                  : undefined
              }
            />

            <div className={outfit.className}>
              <Component {...pageProps} />
            </div>
          </AuthProvider>
        </HydrationBoundary>

        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </>
  );
}