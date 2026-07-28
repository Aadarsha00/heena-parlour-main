const PUBLIC_ENDPOINTS = [
  "/blog/",
  "/services/",
  "/testimonials/",
  "/gallery/",
  "/contact-messages/",
];

const UNAUTHENTICATED_AUTH_ENDPOINTS = new Set([
  "/auth/jwt/create/",
  "/auth/jwt/refresh/",
  "/auth/jwt/verify/",
  "/auth/users/",
  "/auth/users/activation/",
  "/auth/users/resend_activation/",
  "/auth/users/reset_password/",
  "/auth/users/reset_password_confirm/",
]);

const normalizeApiPath = (url?: string): string => {
  if (!url) return "";

  try {
    const pathname = new URL(url, "http://localhost").pathname.replace(
      /^\/api(?=\/)/,
      ""
    );
    return pathname.endsWith("/") ? pathname : `${pathname}/`;
  } catch {
    return "";
  }
};

export const isPublicEndpoint = (url?: string): boolean => {
  const pathname = normalizeApiPath(url);
  return PUBLIC_ENDPOINTS.some((endpoint) => pathname.startsWith(endpoint));
};

export const isUnauthenticatedAuthRequest = (
  url?: string,
  method?: string
): boolean =>
  method?.toLowerCase() === "post" &&
  UNAUTHENTICATED_AUTH_ENDPOINTS.has(normalizeApiPath(url));
