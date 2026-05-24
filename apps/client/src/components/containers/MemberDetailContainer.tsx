import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { MemberDetailView } from "@/components/views/MemberDetailView";
import { useUserQuery } from "@/api/hooks/users";
import { extractApiError } from "@/utils/apiError";

export function MemberDetailContainer() {
  const { userId } = useParams({ from: "/_app/members/$userId" });
  const navigate = useNavigate();
  const router = useRouter();

  const userQ = useUserQuery(userId);

  const onBack = () => {
    if (window.history.length > 1) router.history.back();
    else navigate({ to: "/" });
  };

  return (
    <MemberDetailView
      fullName={userQ.data?.fullName ?? ""}
      email={userQ.data?.email ?? ""}
      avatarUrl={userQ.data?.avatarUrl ?? null}
      isLoading={userQ.isPending}
      errorMessage={
        userQ.isError ? extractApiError(userQ.error, "خطا در دریافت پروفایل.") : undefined
      }
      onBack={onBack}
    />
  );
}
