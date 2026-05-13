import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { SignUpView, type SignUpFormValues } from "@/components/views/SignUpView";
import { useRegisterMutation } from "@/api/hooks/auth";
import { saveAuthTokens } from "@/utils/authToken";

const extractError = (err: unknown): string => {
  if (isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] } | undefined;
    const msg = data?.message;
    if (Array.isArray(msg)) return msg[0] ?? "خطا در ثبت‌نام";
    if (typeof msg === "string") return msg;
  }
  return "خطا در ثبت‌نام. دوباره تلاش کنید.";
};

export function SignUpContainer() {
  const navigate = useNavigate();
  const mutation = useRegisterMutation({
    onSuccess: (tokens) => {
      saveAuthTokens(tokens);
      navigate({ to: "/" });
    },
  });

  const onSubmit = (values: SignUpFormValues) => {
    mutation.mutate({
      fullName: values.name,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <SignUpView
      onSubmit={onSubmit}
      isSubmitting={mutation.isPending}
      errorMessage={mutation.isError ? extractError(mutation.error) : undefined}
    />
  );
}
