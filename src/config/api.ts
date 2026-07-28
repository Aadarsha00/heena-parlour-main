const CANONICAL_API_ORIGIN = "https://api.beautifulbrowsandhenna.com";
const LEGACY_API_ORIGIN = "https://api-beautiful-eyebrow.ctrlbits.xyz";
const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:8000/api/"
  : `${CANONICAL_API_ORIGIN}/api/`;

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

const apiOrigin = API_BASE_URL.startsWith("http")
  ? new URL(API_BASE_URL).origin
  : CANONICAL_API_ORIGIN;

export const getApiAssetUrl = (
  assetUrl: string | null | undefined
): string => {
  if (!assetUrl) {
    return "";
  }

  let normalizedUrl = assetUrl.replace(LEGACY_API_ORIGIN, apiOrigin);

  if (normalizedUrl.startsWith("http://") || normalizedUrl.startsWith("https://")) {
    const url = new URL(normalizedUrl);
    if (url.pathname.startsWith("/blog/")) {
      url.pathname = `/media${url.pathname}`;
    }
    return url.toString();
  }

  if (!normalizedUrl.startsWith("/")) {
    normalizedUrl = `/${normalizedUrl}`;
  }
  if (normalizedUrl.startsWith("/blog/")) {
    normalizedUrl = `/media${normalizedUrl}`;
  }

  return `${apiOrigin}${normalizedUrl}`;
};
