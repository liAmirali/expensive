import axios from "axios";
import { env } from "@/config/env";
import type { AuthTokensDto } from "@/api/generated/schemas";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  getTokenExpiryMs,
  saveAuthTokens,
  subscribeAuthTokens,
} from "@/utils/authToken";

const REFRESH_SKEW_MS = 5 * 60 * 1000;
const MIN_SCHEDULE_MS = 1000;
const MAX_TIMEOUT_MS = 2_147_000_000;

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let inFlight: Promise<string> | null = null;

const rawClient = axios.create({ baseURL: env.VITE_API_BASE_URL });

const cancelScheduledRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

export const refreshAccessToken = (): Promise<string> => {
  if (inFlight) return inFlight;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token available."));
  }

  inFlight = rawClient
    .post<AuthTokensDto>("/api/v1/auth/refresh", { refreshToken })
    .then((res) => {
      saveAuthTokens(res.data);
      return res.data.accessToken;
    })
    .catch((err) => {
      clearAuthTokens();
      throw err;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
};

export const scheduleProactiveRefresh = () => {
  cancelScheduledRefresh();

  const token = getAccessToken();
  const expMs = getTokenExpiryMs(token);
  if (!token || !expMs) return;

  const fireAt = expMs - REFRESH_SKEW_MS;
  const delay = Math.min(
    Math.max(fireAt - Date.now(), MIN_SCHEDULE_MS),
    MAX_TIMEOUT_MS,
  );

  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    refreshAccessToken().catch(() => {
      /* clear + redirect handled by interceptor / route guard */
    });
  }, delay);
};

export const initAuthRefresh = () => {
  subscribeAuthTokens((tokens) => {
    if (tokens) scheduleProactiveRefresh();
    else cancelScheduledRefresh();
  });
  if (getAccessToken()) scheduleProactiveRefresh();
};