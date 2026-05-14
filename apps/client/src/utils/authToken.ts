import type { AuthTokensDto } from "@/api/generated/schemas";

const ACCESS_KEY = "auth_token";
const REFRESH_KEY = "refresh_token";

type TokenListener = (tokens: AuthTokensDto | null) => void;
const listeners = new Set<TokenListener>();

export const subscribeAuthTokens = (fn: TokenListener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const saveAuthTokens = (tokens: AuthTokensDto) => {
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  listeners.forEach((fn) => fn(tokens));
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  listeners.forEach((fn) => fn(null));
};

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

const base64UrlDecode = (input: string): string => {
  const pad = input.length % 4;
  const padded = pad ? input + "=".repeat(4 - pad) : input;
  const b64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64);
};

export const getTokenExpiryMs = (token: string | null): number | null => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};