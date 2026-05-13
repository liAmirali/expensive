import type { AuthTokensDto } from "@/api/generated/schemas";

const ACCESS_KEY = "auth_token";
const REFRESH_KEY = "refresh_token";

export const saveAuthTokens = ({ accessToken, refreshToken }: AuthTokensDto) => {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
