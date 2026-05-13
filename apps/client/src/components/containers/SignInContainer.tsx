import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { SignInView, type SignInFormValues } from "@/components/views/SignInView";
import { useLoginMutation } from "@/api/hooks/auth";
import { saveAuthTokens } from "@/utils/authToken";

const extractError = (err: unknown): string => {
  if (isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] } | undefined;
    const msg = data?.message;
    if (Array.isArray(msg)) return msg[0] ?? "خطا در ورود";
    if (typeof msg === "string") return msg;
  }
  return "خطا در ورود. دوباره تلاش کنید.";
};

export function SignInContainer() {
  const navigate = useNavigate();
  const mutation = useLoginMutation({
    onSuccess: (tokens) => {
      saveAuthTokens(tokens);
      navigate({ to: "/" });
    },
  });

  const onSubmit = (values: SignInFormValues) => {
    mutation.mutate({ email: values.email, password: values.password });
  };

  return (
    <SignInView
      onSubmit={onSubmit}
      isSubmitting={mutation.isPending}
      errorMessage={mutation.isError ? extractError(mutation.error) : undefined}
    />
  );
}
