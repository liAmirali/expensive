import { useMemo } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { LedgerDetailView } from "@/components/views/LedgerDetailView";
import type { ExpensesListItem } from "@/components/composite/ExpensesList";
import { useGroupQuery } from "@/api/hooks/groups";
import { useLedgerQuery } from "@/api/hooks/ledgers";
import { useExpensesListQuery } from "@/api/hooks/expenses";
import { useMeQuery } from "@/api/hooks/users";
import { toFarsi } from "@/utils/numerals";
import { extractApiError } from "@/utils/apiError";
import type { ExpenseResponseDto } from "@/api/generated/schemas";

const formatFaDate = (iso: string) => {
  const d = new Date(iso);
  return toFarsi(
    new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long" }).format(d),
  );
};

const extractError = (err: unknown) =>
  extractApiError(err, "خطا در دریافت اطلاعات دفتر.");

export function LedgerDetailContainer() {
  const { groupId, ledgerId } = useParams({
    from: "/_app/groups/$groupId/ledgers/$ledgerId/",
  });
  const navigate = useNavigate();

  const meQ = useMeQuery();
  const ledgerQ = useLedgerQuery(ledgerId);
  const groupQ = useGroupQuery(groupId);
  const expensesQ = useExpensesListQuery(ledgerId);

  const myId = meQ.data?.id;
  const expenses = expensesQ.data ?? [];

  const { totalSpent, myShare, myPaid } = useMemo(() => {
    let total = 0;
    let share = 0;
    let paid = 0;
    for (const e of expenses) {
      const amount = Number(e.totalAmount);
      total += amount;
      if (e.payerId === myId) paid += amount;
      if (myId) {
        const mine = e.splits.find((s) => s.userId === myId);
        if (mine) share += Number(mine.amountOwed);
      }
    }
    return { totalSpent: total, myShare: share, myPaid: paid };
  }, [expenses, myId]);

  const netBalance = myPaid - myShare;

  const toItem = (e: ExpenseResponseDto): ExpensesListItem => {
    const myAmountOwed = myId
      ? Number(e.splits.find((s) => s.userId === myId)?.amountOwed ?? 0)
      : 0;
    const isPayerMe = e.payerId === myId;
    const direction: ExpensesListItem["direction"] = isPayerMe
      ? myAmountOwed < Number(e.totalAmount)
        ? "owed"
        : "settled"
      : myAmountOwed > 0
      ? "owe"
      : "settled";

    const myStake = isPayerMe ? Number(e.totalAmount) - myAmountOwed : myAmountOwed;

    return {
      id: e.id,
      title: e.title,
      description: e.description ?? undefined,
      totalAmount: Number(e.totalAmount),
      payerName: e.payer.fullName,
      isPayerMe,
      myShare: myStake,
      direction,
      participantCount: e.splits.length,
      dateLabel: formatFaDate(e.expenseDate),
    };
  };

  const error =
    ledgerQ.isError
      ? extractError(ledgerQ.error)
      : expensesQ.isError
      ? extractError(expensesQ.error)
      : undefined;

  return (
    <LedgerDetailView
      ledgerName={ledgerQ.data?.name ?? ""}
      groupName={groupQ.data?.name ?? ""}
      visibility={ledgerQ.data?.visibility ?? "PRIVATE_TO_PARTICIPANTS"}
      closed={!!ledgerQ.data?.closedAt}
      totalSpent={totalSpent}
      myShare={myShare}
      netBalance={netBalance}
      expenseCount={expenses.length}
      expenses={expenses.map(toItem)}
      isLoading={ledgerQ.isPending || expensesQ.isPending}
      errorMessage={error}
      onBack={() => navigate({ to: "/groups/$groupId", params: { groupId } })}
      onAddExpense={() =>
        navigate({
          to: "/groups/$groupId/ledgers/$ledgerId/expenses/new",
          params: { groupId, ledgerId },
        })
      }
    />
  );
}