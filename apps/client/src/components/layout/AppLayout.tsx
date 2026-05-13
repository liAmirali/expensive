import { Outlet } from "@tanstack/react-router";
import { FloatingBottomNav } from "@/components/composite/FloatingBottomNav";

export function AppLayout() {
  return (
    <div className="relative min-h-dvh w-full bg-bg">
      <main className="mx-auto w-full max-w-md px-4 pt-6 pb-32">
        <Outlet />
      </main>
      <FloatingBottomNav />
    </div>
  );
}
