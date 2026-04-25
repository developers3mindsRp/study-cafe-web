import type { IncomingMessage } from "http";

/**
 * Normalized API root, e.g. https://api.studycafe.in/api
 * (always ends with /api, no trailing slash after /api).
 */
export function normalizePublicApiBase(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  let s = raw.trim().replace(/\/+$/, "");
  if (!s.endsWith("/api")) s = `${s}/api`;
  return s;
}

/** Use deployed API when NEXT_PUBLIC_API_BASE_URL is set (browser + SSR). */
export function getPublicApiBaseFromEnv(): string | null {
  if (typeof process === "undefined") return null;
  return normalizePublicApiBase(process.env.NEXT_PUBLIC_API_BASE_URL);
}

export function getBrowserApiBase(): string {
  const fromEnv = getPublicApiBaseFromEnv();
  if (fromEnv) return fromEnv;
  return "/api";
}

export function getServerSideApiBaseUrl(req: IncomingMessage): string {
  const fromEnv = getPublicApiBaseFromEnv();
  if (fromEnv) return fromEnv;

  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto =
    typeof forwardedProto === "string"
      ? forwardedProto.split(",")[0].trim()
      : "http";
  const host = req.headers.host || "localhost:3000";
  return `${proto}://${host}/api`;
}

/** Registered by server-only `serverApiContext.ts` so shared axios can read per-request base without importing Node APIs in the client bundle. */
let serverApiBaseGetter: (() => string | undefined) | null = null;

export function setServerApiBaseGetter(fn: () => string | undefined) {
  serverApiBaseGetter = fn;
}

export function getServerApiBaseFromContext(): string | undefined {
  if (typeof window !== "undefined") return undefined;
  return serverApiBaseGetter?.();
}
