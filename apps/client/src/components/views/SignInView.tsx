import { Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

const schema = z.object({
  email:    z.email("فرمت ایمیل نامعتبر است").min(1, "ایمیل الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

type FormValues = z.infer<typeof schema>;

export function SignInView() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onTouched" });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    console.log("signin", values);
  };

  return (
    <div className="animate-fade-in-up">
      <GlassCard padding="xl">
        <header className="mb-8 text-center">
          <h1 className="text-h1 font-bold text-text">خوش آمدید</h1>
          <p className="mt-2 text-body-md text-text-muted">برای ادامه وارد حساب خود شوید</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          <Input
            label="ایمیل"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            dir="ltr"
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="رمز عبور"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex justify-end">
            <Link
              to="/signin"
              className="text-label-sm font-medium text-accent-text hover:underline underline-offset-4"
            >
              فراموشی رمز عبور؟
            </Link>
          </div>

          <Button type="submit" size="lg" width="full" loading={isSubmitting}>
            ورود
          </Button>
        </form>

        <p className="mt-6 text-center text-body-sm text-text-muted">
          حساب کاربری ندارید؟{" "}
          <Link to="/signup" className="font-medium text-accent-text hover:underline underline-offset-4">
            ثبت‌نام کنید
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
