import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Home, Users, User } from "lucide-react";

type NavPath = "/home" | "/groups" | "/profile";

interface NavItem {
  to: NavPath;
  label: string;
  Icon: LucideIcon;
}

const items: NavItem[] = [
  { to: "/home",    label: "خانه",     Icon: Home },
  { to: "/groups",  label: "گروه‌ها",  Icon: Users },
  { to: "/profile", label: "حساب من",  Icon: User },
];

const ROOT_TABS: NavPath[] = ["/home", "/groups", "/profile"];

export function FloatingBottomNav() {
  const { pathname } = useLocation();
  const isRootTab = ROOT_TABS.includes(pathname as NavPath);
  if (!isRootTab) return null;

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-4"
    >
      <ul className="pointer-events-auto flex items-center gap-1 rounded-pill bg-[var(--p-ink-950)] p-1.5 shadow-[0_20px_50px_-15px_rgba(11,0,20,0.55)]">
        {items.map(({ to, label, Icon }) => {
          const active = pathname === to || pathname.startsWith(`${to}/`);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={`flex size-12 items-center justify-center rounded-pill transition-colors ${
                  active
                    ? "bg-white text-(--p-ink-950)"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Icon size={22} strokeWidth={2} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
