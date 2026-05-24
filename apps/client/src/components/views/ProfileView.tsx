import { useEffect, useState, type FormEvent } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

export interface ProfileFormValues {
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  preferredCurrency: string;
  preferredLocale: string;
}

export interface ProfileViewProps {
  email: string;
  initialValues: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => void;
  onLogout?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
  successMessage?: string;
}

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase();

export function ProfileView({
  email,
  initialValues,
  onSubmit,
  onLogout,
  isSubmitting = false,
  errorMessage,
  successMessage,
}: ProfileViewProps) {
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [avatarBroken, setAvatarBroken] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    setAvatarBroken(false);
  }, [values.avatarUrl]);

  const setField = (field: keyof ProfileFormValues, v: string) =>
    setValues((prev) => ({ ...prev, [field]: v }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      ...values,
      fullName: values.fullName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      avatarUrl: values.avatarUrl.trim(),
      preferredCurrency: values.preferredCurrency.trim(),
      preferredLocale: values.preferredLocale.trim(),
    });
  };

  const hasAvatar = values.avatarUrl.trim().length > 0 && !avatarBroken;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in pb-24">
      <header className="flex items-center justify-between">
        <h1 className="text-h2 font-bold text-text">حساب من</h1>
        {onLogout && (
          <Button
            type="button"
            variant="ghost"
            color="negative"
            size="sm"
            startIcon={<LogOut size={16} />}
            onClick={onLogout}
          >
            خروج
          </Button>
        )}
      </header>

      <GlassCard padding="lg" radius="xl">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-pill bg-[var(--p-violet-100)] text-[var(--p-violet-700)]">
            {hasAvatar ? (
              <img
                src={values.avatarUrl}
                alt={values.fullName}
                className="size-full object-cover"
                onError={() => setAvatarBroken(true)}
              />
            ) : (
              <span className="text-h2 font-bold">
                {initialsOf(values.fullName) || <UserIcon size={32} />}
              </span>
            )}
          </div>
          <p className="text-body-sm text-text-muted">{email}</p>
        </div>
      </GlassCard>

      <div className="flex flex-col gap-4">
        <Input
          label="نام و نام خانوادگی"
          value={values.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          autoComplete="name"
        />
        <Input
          label="شماره تلفن"
          type="tel"
          dir="ltr"
          value={values.phoneNumber}
          onChange={(e) => setField("phoneNumber", e.target.value)}
          autoComplete="tel"
          placeholder="+98..."
        />
        <Input
          label="نشانی تصویر پروفایل"
          type="url"
          dir="ltr"
          value={values.avatarUrl}
          onChange={(e) => setField("avatarUrl", e.target.value)}
          placeholder="https://..."
          helperText={
            avatarBroken && values.avatarUrl.trim().length > 0
              ? "تصویر بارگذاری نشد. نشانی را بررسی کنید."
              : "URL تصویر را وارد کنید."
          }
        />
        <Input
          label="واحد پول پیش‌فرض"
          value={values.preferredCurrency}
          onChange={(e) => setField("preferredCurrency", e.target.value)}
          placeholder="IRR"
          dir="ltr"
        />
        <Input
          label="زبان"
          value={values.preferredLocale}
          onChange={(e) => setField("preferredLocale", e.target.value)}
          placeholder="fa-IR"
          dir="ltr"
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-center text-body-sm text-negative-text">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p role="status" className="text-center text-body-sm text-positive-text">
          {successMessage}
        </p>
      )}

      <Button type="submit" size="lg" width="full" loading={isSubmitting}>
        ذخیره تغییرات
      </Button>
    </form>
  );
}
