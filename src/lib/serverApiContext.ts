import { AsyncLocalStorage } from "async_hooks";
import type { IncomingMessage } from "http";
import {
  getServerSideApiBaseUrl,
  setServerApiBaseGetter,
} from "@/lib/apiBase";

const serverApiBase = new AsyncLocalStorage<string>();

setServerApiBaseGetter(() => serverApiBase.getStore());

/**
 * Run SSR data loaders so axios uses the same host as the browser (e.g. :3001) and
 * Next rewrites `/api` → gateway — fixes wrong port when NEXT_PUBLIC_API_BASE_URL is unset.
 */
export function runWithServerApiBase<T>(
  req: IncomingMessage,
  fn: () => T | Promise<T>
): T | Promise<T> {
  return serverApiBase.run(getServerSideApiBaseUrl(req), fn);
}
