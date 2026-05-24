import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ProfileView, type ProfileFormValues } from "@/components/views/ProfileView";
import { useMeQuery, useUpdateMeMutation } from "@/api/hooks/users";
import { clearAuthTokens } from "@/utils/authToken";
import { extractApiError } from "@/utils/apiError";

const emptyValues: ProfileFormValues = {
  fullName: "",
  phoneNumber: "",
  avatarUrl: "",
  preferredCurrency: "",
  preferredLocale: "",
};

export function ProfileContainer() {
  const navigate = useNavigate();
  const meQ = useMeQuery();
  const [success, setSuccess] = useState(false);

  const mutation = useUpdateMeMutation({
    onSuccess: () => setSuccess(true),
    onError: () => setSuccess(false),
  });

  const initialValues: ProfileFormValues = meQ.data
    ? {
        fullName: meQ.data.fullName ?? "",
        phoneNumber: meQ.data.phoneNumber ?? "",
        avatarUrl: meQ.data.avatarUrl ?? "",
        preferredCurrency: meQ.data.preferredCurrency ?? "",
        preferredLocale: meQ.data.preferredLocale ?? "",
      }
    : emptyValues;

  const handleSubmit = (values: ProfileFormValues) => {
    setSuccess(false);
    mutation.mutate({
      fullName: values.fullName,
      phoneNumber: values.phoneNumber || undefined,
      avatarUrl: values.avatarUrl || undefined,
      preferredCurrency: values.preferredCurrency || undefined,
      preferredLocale: values.preferredLocale || undefined,
    });
  };

  const handleLogout = () => {
    clearAuthTokens();
    navigate({ to: "/signin" });
  };

  return (
    <ProfileView
      email={meQ.data?.email ?? ""}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onLogout={handleLogout}
      isSubmitting={mutation.isPending}
      errorMessage={
        mutation.isError
          ? extractApiError(mutation.error, "خطا در ذخیره تغییرات.")
          : meQ.isError
          ? extractApiError(meQ.error, "خطا در بارگذاری اطلاعات.")
          : undefined
      }
      successMessage={success ? "تغییرات ذخیره شد." : undefined}
    />
  );
}
