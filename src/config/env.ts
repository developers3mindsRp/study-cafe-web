/**
 * Central env access for the storefront (no secrets — public URLs only).
 *
 * IMPORTANT: Next.js only embeds NEXT_PUBLIC_* vars when accessed as
 * process.env.NEXT_PUBLIC_FOO — not process.env[name]. Use static reads below.
 */

function requirePublic(value: string | undefined, name: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in study-cafe-web/.env and restart the dev server.`,
    );
  }
  return trimmed;
}

function requireServer(value: string | undefined, name: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in study-cafe-web/.env and restart the dev server.`,
    );
  }
  return trimmed;
}

export function getPublicApiBaseUrl(): string {
  return requirePublic(process.env.NEXT_PUBLIC_API_BASE_URL, 'NEXT_PUBLIC_API_BASE_URL');
}

export function getGatewayOrigin(): string {
  return requireServer(process.env.API_GATEWAY_ORIGIN, 'API_GATEWAY_ORIGIN').replace(/\/+$/, '');
}

export function getApiServerOrigin(): string {
  return getPublicApiBaseUrl().replace(/\/api\/?$/, '');
}

export function getAssetsOrigin(): string {
  return requirePublic(process.env.NEXT_PUBLIC_ASSETS_ORIGIN, 'NEXT_PUBLIC_ASSETS_ORIGIN').replace(/\/$/, '');
}

export function getSiteUrl(): string {
  return requirePublic(process.env.NEXT_PUBLIC_SITE_URL, 'NEXT_PUBLIC_SITE_URL').replace(/\/$/, '');
}

export function getMediaOrigin(): string {
  const media = process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.trim();
  if (media) return media.replace(/\/$/, '');
  return getSiteUrl();
}

export function getServerApiBaseUrl(): string {
  return requireServer(process.env.SERVER_API_BASE_URL, 'SERVER_API_BASE_URL');
}
