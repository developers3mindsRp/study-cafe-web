"use client";

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { fetchSeoMetadataByPath } from "@/services/platform.service";
import { mergeGlobalSeoDefaults, SITE_BRAND } from "@/lib/seo/defaultSeo";
import { pathnameForSeoLookup } from "@/lib/seo/normalize";
import { shouldFetchGlobalSeoForPathname } from "@/lib/seo/seoRoutePolicy";
import type { SeoMetadata } from "@/types/models.types";

function formatTitle(mt: string): string {
  const t = mt.trim();
  if (!t) return SITE_BRAND;
  return t.toLowerCase().includes("studycafe") ? t : `${t} | ${SITE_BRAND}`;
}

type AppRouteSeoProps = {
  /** SSR SEO from middleware header (via page getServerSideProps). */
  ssrSeo?: SeoMetadata | null;
  ssrPathname?: string;
};

export function AppRouteSeo({ ssrSeo, ssrPathname }: AppRouteSeoProps = {}) {
  const router = useRouter();
  /** Actual URL (/blogs/foo), not the route pattern (/blogs/[slug]) — required for CMS SEO by-path. */
  const pathname = pathnameForSeoLookup(router.asPath || router.pathname || "/");
  const ssrPath = ssrPathname ? pathnameForSeoLookup(ssrPathname) : "";
  const initialSeo =
    ssrSeo && ssrPath && ssrPath === pathname ? ssrSeo : null;
  const [seo, setSeo] = useState<SeoMetadata | null>(initialSeo);

  useEffect(() => {
    if (ssrSeo && ssrPath && ssrPath === pathname) {
      setSeo(ssrSeo);
    }
  }, [ssrSeo, ssrPath, pathname]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!shouldFetchGlobalSeoForPathname(pathname)) {
        setSeo(null);
        return;
      }
      try {
        const row = await fetchSeoMetadataByPath(pathname);
        if (!cancelled) setSeo(row);
      } catch {
        if (!cancelled) setSeo(null);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const merged = useMemo(
    () => mergeGlobalSeoDefaults(pathname, seo),
    [pathname, seo]
  );

  const title = useMemo(() => formatTitle(merged.metaTitle), [merged.metaTitle]);

  if (!shouldFetchGlobalSeoForPathname(pathname)) {
    return null;
  }

  const description = merged.metaDescription.slice(0, 320);
  const ogTitle = merged.ogTitle?.trim() || title;
  const ogDescription =
    merged.ogDescription?.trim() || description;

  /** Crawlers reject relative og:image / og:url, so both are absolute by here. */
  const ogImage = merged.ogImageUrl?.trim() || "";
  const canonical = merged.canonicalUrl?.trim() || "";

  return (
    <Head key={pathname}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {merged.metaKeywords?.trim() ? (
        <meta name="keywords" content={merged.metaKeywords.trim()} />
      ) : null}
      {merged.robots?.trim() ? (
        <meta name="robots" content={merged.robots.trim()} />
      ) : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:site_name" content={SITE_BRAND} key="og:site_name" />
      <meta property="og:title" content={ogTitle} key="og:title" />
      <meta property="og:description" content={ogDescription} key="og:description" />
      <meta property="og:type" content="website" key="og:type" />
      {canonical ? (
        <meta property="og:url" content={canonical} key="og:url" />
      ) : null}
      {ogImage ? (
        <meta property="og:image" content={ogImage} key="og:image" />
      ) : null}
      {ogImage ? (
        <meta
          property="og:image:secure_url"
          content={ogImage}
          key="og:image:secure_url"
        />
      ) : null}
      {ogImage ? (
        <meta property="og:image:alt" content={ogTitle} key="og:image:alt" />
      ) : null}

      <meta
        name="twitter:card"
        content={ogImage ? "summary_large_image" : "summary"}
        key="twitter:card"
      />
      <meta name="twitter:title" content={ogTitle} key="twitter:title" />
      <meta
        name="twitter:description"
        content={ogDescription}
        key="twitter:description"
      />
      {ogImage ? (
        <meta name="twitter:image" content={ogImage} key="twitter:image" />
      ) : null}
    </Head>
  );
}
