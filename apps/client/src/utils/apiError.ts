import { isAxiosError } from "axios";

type FieldError = { field?: string; errors?: string[] };

const renderFieldError = (fe: FieldError, fallback: string): string => {
  if (Array.isArray(fe.errors) && fe.errors.length > 0) {
    return fe.field ? `${fe.field}: ${fe.errors[0]}` : fe.errors[0]!;
  }
  return fe.field ? `${fe.field}: ${fallback}` : fallback;
};

export const extractApiError = (err: unknown, fallback = "خطایی رخ داد. دوباره تلاش کنید."): string => {
  if (!isAxiosError(err)) return fallback;

  const data = err.response?.data as { message?: unknown } | undefined;
  const msg = data?.message;

  if (typeof msg === "string") return msg;

  if (Array.isArray(msg) && msg.length > 0) {
    const first = msg[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      return renderFieldError(first as FieldError, fallback);
    }
  }

  return fallback;
};
