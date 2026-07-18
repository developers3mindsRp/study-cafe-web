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

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => defaultQueryClient);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
      </Head>

      {/* ==================== Google Tag Manager ==================== */}
      <Script id="gtm" strategy="afterInteractive">
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

      {/* ==================== Google Analytics (Universal Analytics) ==================== */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=UA-26881622-1"
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-26881622-1');
        `}
      </Script>

      {/* ==================== Facebook Pixel ==================== */}
      <Script id="facebook-pixel" strategy="afterInteractive">
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

          fbq('init','280305326909957');
          fbq('track','PageView');
        `}
      </Script>

      {/* ==================== WebTrafficSource ==================== */}
      <Script id="webtrafficsource" strategy="afterInteractive">
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

      {/* ==================== External Scripts ==================== */}

      <Script
        src="https://rtb-global.com/rtbv2.js"
        strategy="afterInteractive"
      />

      <Script
        src="https://wd-ret.io/rtg/v1/retag.js"
        strategy="afterInteractive"
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
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-TRZDN6BG"
          height="0"
          width="0"
          style={{
            display: "none",
            visibility: "hidden",
          }}
        />
      </noscript>

      {/* ==================== Facebook Pixel NoScript ==================== */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=280305326909957&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>

      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <AuthProvider>
            <MarketingTrackingInjector />

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