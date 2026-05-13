import type { ReactNode } from "react";
import { LogOut, Settings } from "lucide-react";
import { BalanceCard } from "@/components/ui/BalanceCard";
import { RecentExpenses } from "@/components/composite/RecentExpenses";
import type { ExpenseListItemProps } from "@/components/ui/ExpenseListItem";

export interface HomeViewProps {
  userName: string;
  netBalance: number;
  balanceCaption?: ReactNode;
  recentExpenses: (ExpenseListItemProps & { id: string })[];
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onSeeAllExpensesClick?: () => void;
}

export function HomeView({
  userName,
  netBalance,
  balanceCaption,
  recentExpenses,
  onSettingsClick,
  onLogoutClick,
  onSeeAllExpensesClick,
}: HomeViewProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-body-sm text-text-muted">خوش آمدید،</p>
          <h1 className="text-h2 font-bold text-text">{userName}</h1>
        </div>
        <div className="flex items-center gap-1">
          <IconButton aria-label="تنظیمات" onClick={onSettingsClick}>
            <Settings size={20} />
          </IconButton>
          <IconButton aria-label="خروج" onClick={onLogoutClick}>
            <LogOut size={20} />
          </IconButton>
        </div>
      </header>

      <BalanceCard
        label="خالص موجودی"
        amount={netBalance}
        caption={balanceCaption}
      />

      <RecentExpenses
        items={recentExpenses}
        onActionClick={onSeeAllExpensesClick}
      />
    </div>
  );
}

function IconButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="flex size-10 items-center justify-center rounded-pill text-text-muted hover:bg-surface hover:text-text transition-colors cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
}
