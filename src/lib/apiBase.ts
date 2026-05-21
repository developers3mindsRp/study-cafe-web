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

/**
 * Base URL for server-side fetches (GSSP, etc.).
 *
 * Priority:
 * 1. `SERVER_API_BASE_URL` — optional; use when the browser hits the site on a hostname where `/api` is not routed to the gateway (Docker / split domains).
 * 2. `NEXT_PUBLIC_API_BASE_URL` — normal production setup (same URL must be reachable from this Node process).
 * 3. `API_GATEWAY_ORIGIN` — same as `next.config.mjs` rewrites; avoids relying on `Host` when the front domain ≠ API.
 * 4. `x-forwarded-proto` + `Host` + `/api` — dev / single-host proxies only.
 */
export function getServerSideApiBaseUrl(req: IncomingMessage): string {
  const serverOnly = normalizePublicApiBase(process.env.SERVER_API_BASE_URL);
  if (serverOnly) return serverOnly;

  const fromEnv = getPublicApiBaseFromEnv();
  if (fromEnv) return fromEnv;

  const fromGateway = normalizePublicApiBase(process.env.API_GATEWAY_ORIGIN);
  if (fromGateway) return fromGateway;

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
