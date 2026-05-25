import type { IncomingMessage } from 'http';
import {
  getGatewayOrigin,
  getPublicApiBaseUrl,
  getServerApiBaseUrl,
} from '@/config/env';

export function normalizePublicApiBase(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  let s = raw.trim().replace(/\/+$/, '');
  if (!s.endsWith('/api')) s = `${s}/api`;
  return s;
}

export function getPublicApiBaseFromEnv(): string {
  return normalizePublicApiBase(getPublicApiBaseUrl())!;
}

export function getBrowserApiBase(): string {
  return getPublicApiBaseFromEnv();
}

export function getServerSideApiBaseUrl(req: IncomingMessage): string {
  const serverOnly = normalizePublicApiBase(getServerApiBaseUrl());
  if (serverOnly) return serverOnly;

  const fromEnv = getPublicApiBaseFromEnv();
  if (fromEnv) return fromEnv;

  const fromGateway = normalizePublicApiBase(`${getGatewayOrigin()}/api`);
  if (fromGateway) return fromGateway;

  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto =
    typeof forwardedProto === 'string'
      ? forwardedProto.split(',')[0].trim()
      : 'http';
  const host = req.headers.host;
  if (!host) {
    throw new Error(
      'Cannot resolve server API base URL: set NEXT_PUBLIC_API_BASE_URL or SERVER_API_BASE_URL in .env',
    );
  }
  return `${proto}://${host}/api`;
}

let serverApiBaseGetter: (() => string | undefined) | null = null;

export function setServerApiBaseGetter(fn: () => string | undefined) {
  serverApiBaseGetter = fn;
}

export function getServerApiBaseFromContext(): string | undefined {
  if (typeof window !== 'undefined') return undefined;
  return serverApiBaseGetter?.();
}
