import { useNavigate } from "@tanstack/react-router";
import { SignUpView, type SignUpFormValues } from "@/components/views/SignUpView";
import { useRegisterMutation } from "@/api/hooks/auth";
import { saveAuthTokens } from "@/utils/authToken";
import { extractApiError } from "@/utils/apiError";

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
      errorMessage={mutation.isError ? extractApiError(mutation.error, "خطا در ثبت‌نام. دوباره تلاش کنید.") : undefined}
    />
  );
}
