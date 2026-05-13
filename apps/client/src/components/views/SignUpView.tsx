import { Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { evaluatePassword } from "@/utils/password";

const schema = z
  .object({
    name:            z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
    email:           z.email("فرمت ایمیل نامعتبر است").min(1, "ایمیل الزامی است"),
    password:        z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمز عبور و تکرار آن یکسان نیستند",
  })
  .refine((d) => evaluatePassword(d.password).strength !== "weak", {
    path: ["password"],
    message: "رمز عبور بسیار ضعیف است",
  });

export type SignUpFormValues = z.infer<typeof schema>;

export interface SignUpViewProps {
  onSubmit: (values: SignUpFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string;
}

export function SignUpView({ onSubmit, isSubmitting = false, errorMessage }: SignUpViewProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = useWatch({ control, name: "password" });

  return (
    <div className="animate-fade-in-up">
      <GlassCard padding="xl">
        <header className="mb-8 text-center">
          <h1 className="text-h1 font-bold text-text">ساخت حساب جدید</h1>
          <p className="mt-2 text-body-md text-text-muted">برای شروع، اطلاعات زیر را پر کنید</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <Input
            label="نام و نام خانوادگی"
            autoComplete="name"
            placeholder="مثلاً سارا محمدی"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="ایمیل"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            dir="ltr"
            error={errors.email?.message}
            {...register("email")}
          />

          <div>
            <PasswordInput
              label="رمز عبور"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <PasswordStrength value={password ?? ""} />
          </div>

          <PasswordInput
            label="تکرار رمز عبور"
            autoComplete="new-password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {errorMessage && (
            <p role="alert" className="text-body-sm text-danger-text text-center">
              {errorMessage}
            </p>
          )}

          <Button type="submit" size="lg" width="full" loading={isSubmitting}>
            ساخت حساب
          </Button>
        </form>

        <p className="mt-6 text-center text-body-sm text-text-muted">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link to="/signin" className="font-medium text-accent-text hover:underline underline-offset-4">
            وارد شوید
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
