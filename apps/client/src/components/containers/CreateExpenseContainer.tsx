import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CreateExpenseView, type WizardStep } from "@/components/views/CreateExpenseView";
import type { PayerSelectorOption } from "@/components/composite/PayerSelector";
import type { ParticipantsToggleOption } from "@/components/composite/ParticipantsToggleList";
import { useGroupQuery } from "@/api/hooks/groups";
import { useLedgerQuery } from "@/api/hooks/ledgers";
import { useMeQuery } from "@/api/hooks/users";
import { useCreateExpenseMutation } from "@/api/hooks/expenses";
import { equalSplit } from "@/utils/expenseSplit";
import { toFarsi } from "@/utils/numerals";
import {
  GroupMembershipStatus,
  SplitMethod,
  type SplitMethod as SplitMethodT,
} from "@/api/generated/schemas";
import { extractApiError } from "@/utils/apiError";

const extractError = (err: unknown) =>
  extractApiError(err, "خطا در ثبت خرج. دوباره تلاش کنید.");

const formatFaDate = (d: Date) =>
  toFarsi(
    new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long", year: "numeric" })
      .format(d),
  );

export function CreateExpenseContainer() {
  const { groupId, ledgerId } = useParams({
    from: "/_app/groups/$groupId/ledgers/$ledgerId/expenses/new",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const meQ = useMeQuery();
  const groupQ = useGroupQuery(groupId);
  const ledgerQ = useLedgerQuery(ledgerId);

  const myId = meQ.data?.id;

  const members = useMemo(
    () =>
      groupQ.data?.members
        ?.filter((m) => m.status === GroupMembershipStatus.ACTIVE)
        .map((m) => m.user) ?? [],
    [groupQ.data?.members],
  );

  const [step, setStep] = useState<WizardStep>(1);
  const [amount, setAmount] = useState(0);
  const [payerId, setPayerId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [participantIds, setParticipantIds] = useState<Set<string>>(new Set());
  const [splitMethod, setSplitMethod] = useState<SplitMethodT>(SplitMethod.EQUAL);
  const [expenseDate] = useState(() => new Date());

  // Defaults once user + group data lands
  useEffect(() => {
    if (myId) {
      setPayerId((prev) => prev ?? myId);
      setParticipantIds((prev) => (prev.size === 0 ? new Set(members.map((u) => u.id)) : prev));
    }
  }, [myId, members]);

  const pushDigit = (d: string) =>
    setAmount((prev) => {
      const next = prev * 10 + Number(d);
      return next > 1_000_000_000_000 ? prev : next;
    });
  const pushTripleZero = () =>
    setAmount((prev) => {
      if (prev === 0) return 0;
      const next = prev * 1000;
      return next > 1_000_000_000_000 ? prev : next;
    });
  const backspace = () => setAmount((prev) => Math.floor(prev / 10));

  const toggleParticipant = (id: string) =>
    setParticipantIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleCategoryClick = (id: string, label: string) => {
    setSelectedCategoryId((curr) => {
      if (curr === id) {
        setDescription("");
        return null;
      }
      setDescription(label);
      return id;
    });
  };

  const payerOptions: PayerSelectorOption[] = members.map((u) => ({
    id: u.id,
    fullName: u.fullName,
  }));

  const participantOptions: ParticipantsToggleOption[] = members.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    locked: false,
  }));

  const selectedIdList = useMemo(() => Array.from(participantIds), [participantIds]);
  const splits = useMemo(() => equalSplit(amount, selectedIdList), [amount, selectedIdList]);
  const perPersonAmount = (id: string) =>
    Number(splits.find((s) => s.userId === id)?.amountOwed ?? "0");

  const splitSummary = `مساوی، ${toFarsi(participantIds.size)} نفر`;

  const createMutation = useCreateExpenseMutation(ledgerId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", ledgerId] });
      queryClient.invalidateQueries({ queryKey: ["balances", ledgerId] });
      navigate({ to: "/groups/$groupId", params: { groupId } });
    },
  });

  const canGoNext = (() => {
    if (createMutation.isPending) return false;
    if (step === 1) return amount > 0;
    if (step === 2) return !!payerId && description.trim().length > 0;
    if (step === 3) return participantIds.size > 0 && splitMethod === SplitMethod.EQUAL;
    if (step === 4) return !!payerId && participantIds.size > 0 && amount > 0;
    return false;
  })();

  const handleNext = () => {
    if (step < 4) {
      setStep((s) => (s + 1) as WizardStep);
      return;
    }
    if (!payerId) return;
    createMutation.mutate({
      payerId,
      title: description.trim(),
      totalAmount: String(amount),
      expenseDate: expenseDate.toISOString(),
      splitMethod: SplitMethod.EQUAL,
      splits,
    });
  };

  const handleBack = () => {
    if (step === 1) {
      navigate({ to: "/groups/$groupId", params: { groupId } });
      return;
    }
    setStep((s) => (s - 1) as WizardStep);
  };

  return (
    <CreateExpenseView
      step={step}
      ledgerName={ledgerQ.data?.name ?? ""}
      amount={amount}
      onDigit={pushDigit}
      onTripleZero={pushTripleZero}
      onBackspace={backspace}
      payerOptions={payerOptions}
      payerId={payerId}
      onPayerChange={setPayerId}
      description={description}
      onDescriptionChange={(v) => {
        setDescription(v);
        setSelectedCategoryId(null);
      }}
      selectedCategoryId={selectedCategoryId}
      onCategoryClick={handleCategoryClick}
      splitMethod={splitMethod}
      onSplitMethodChange={(m) => {
        if (m === SplitMethod.EQUAL) setSplitMethod(m);
      }}
      participantOptions={participantOptions}
      selectedParticipantIds={participantIds}
      onToggleParticipant={toggleParticipant}
      perPersonAmount={perPersonAmount}
      splitSummary={splitSummary}
      expenseDateLabel={formatFaDate(expenseDate)}
      onBack={handleBack}
      onNext={handleNext}
      canGoNext={canGoNext}
      isSubmitting={createMutation.isPending}
      errorMessage={createMutation.isError ? extractError(createMutation.error) : undefined}
    />
  );
}
