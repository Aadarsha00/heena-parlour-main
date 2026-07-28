export const CANONICAL_API_BASE_URL =
  "https://api.beautifulbrowsandhenna.com/api/";
export const LOCAL_API_BASE_URL = "http://localhost:8000/api/";

const isProductionSafeUrl = (value: string): boolean => {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

export const selectApiBaseUrl = (
  configuredUrl: string | undefined,
  isProduction: boolean
): string => {
  const configured = configuredUrl?.trim();

  if (isProduction) {
    if (!configured) {
      return CANONICAL_API_BASE_URL;
    }

    if (!isProductionSafeUrl(configured)) {
      throw new Error(
        "Invalid VITE_API_BASE_URL for production. Use an HTTPS URL or a same-origin path beginning with /."
      );
    }

    return configured;
  }

  return configured || LOCAL_API_BASE_URL;
};
