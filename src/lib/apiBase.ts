import type { IncomingMessage } from "http";

export function getBrowserApiBase(): string {
  return "/api";
}
export function getServerSideApiBaseUrl(req: IncomingMessage): string {
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
