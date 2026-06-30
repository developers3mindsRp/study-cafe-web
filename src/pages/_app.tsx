import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Outfit } from "next/font/google";
import { useState } from "react";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
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
  // Use a single instance of QueryClient for the entire app lifecycle
  // This ensures proper SSR hydration
  const [queryClient] = useState(() => defaultQueryClient);

  return (
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
      {/* Show React Query Devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
