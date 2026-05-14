import { useNavigate } from "@tanstack/react-router";
import { SignInView, type SignInFormValues } from "@/components/views/SignInView";
import { useLoginMutation } from "@/api/hooks/auth";
import { saveAuthTokens } from "@/utils/authToken";
import { extractApiError } from "@/utils/apiError";

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
      errorMessage={mutation.isError ? extractApiError(mutation.error, "خطا در ورود. دوباره تلاش کنید.") : undefined}
    />
  );
}
