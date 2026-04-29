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

export function AppRouteSeo() {
  const router = useRouter();
  const pathname = pathnameForSeoLookup(router.pathname || "/");
  const [seo, setSeo] = useState<SeoMetadata | null>(null);

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
      {merged.canonicalUrl?.trim() ? (
        <link rel="canonical" href={merged.canonicalUrl.trim()} />
      ) : null}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      {merged.ogImageUrl?.trim() ? (
        <meta property="og:image" content={merged.ogImageUrl.trim()} />
      ) : null}
      <meta property="og:type" content="website" />
    </Head>
  );
}
