import { Outlet } from "@tanstack/react-router";

export function AuthLayout() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -start-32 size-[520px] rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient(closest-side, var(--p-violet-300), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -end-32 size-[560px] rounded-full blur-3xl opacity-55"
        style={{ background: "radial-gradient(closest-side, var(--p-cerise-300), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 start-1/2 -translate-x-1/2 size-[420px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(closest-side, var(--p-teal-300), transparent 70%)" }}
      />

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
