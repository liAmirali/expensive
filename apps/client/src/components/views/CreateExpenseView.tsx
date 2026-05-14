import { ChevronRight, UtensilsCrossed, Hotel, Car, Fuel } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Numpad } from "@/components/ui/Numpad";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { GlassCard } from "@/components/ui/GlassCard";
import { PayerSelector, type PayerSelectorOption } from "@/components/composite/PayerSelector";
import {
  ParticipantsToggleList,
  type ParticipantsToggleOption,
} from "@/components/composite/ParticipantsToggleList";
import { formatToman, toFarsi } from "@/utils/numerals";
import { SplitMethod, type SplitMethod as SplitMethodT } from "@/api/generated/schemas";

export type WizardStep = 1 | 2 | 3 | 4;

const CATEGORIES: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "food",   label: "غذا",    icon: <UtensilsCrossed size={14} /> },
  { id: "hotel",  label: "هتل",    icon: <Hotel size={14} /> },
  { id: "taxi",   label: "تاکسی",  icon: <Car size={14} /> },
  { id: "fuel",   label: "بنزین",  icon: <Fuel size={14} /> },
];

export interface CreateExpenseViewProps {
  step: WizardStep;
  ledgerName: string;

  // Step 1 — amount
  amount: number;
  onDigit: (d: string) => void;
  onTripleZero: () => void;
  onBackspace: () => void;

  // Step 2 — payer + title
  payerOptions: PayerSelectorOption[];
  payerId: string | null;
  onPayerChange: (id: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  selectedCategoryId: string | null;
  onCategoryClick: (id: string, label: string) => void;

  // Step 3 — split
  splitMethod: SplitMethodT;
  onSplitMethodChange: (m: SplitMethodT) => void;
  participantOptions: ParticipantsToggleOption[];
  selectedParticipantIds: Set<string>;
  onToggleParticipant: (id: string) => void;
  perPersonAmount: (id: string) => number;

  // Step 4 — confirm
  splitSummary: string;
  expenseDateLabel: string;

  // Nav
  onBack: () => void;
  onNext: () => void;
  canGoNext: boolean;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const STEP_TITLES: Record<WizardStep, string> = {
  1: "چقدر؟",
  2: "کی حساب کرد؟",
  3: "بین کیا؟",
  4: "تأیید",
};

export function CreateExpenseView(props: CreateExpenseViewProps) {
  const { step, onBack, onNext, canGoNext, isSubmitting, errorMessage } = props;

  return (
    <div className="flex flex-col gap-6 animate-fade-in min-h-[calc(100dvh-3rem)]">
      <header className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="بازگشت"
          className="flex size-10 shrink-0 items-center justify-center rounded-pill text-text-muted hover:bg-surface hover:text-text transition-colors cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-h3 font-bold text-text">{STEP_TITLES[step]}</h1>
          <StepIndicator current={step} total={4} />
        </div>
        <div className="size-10 shrink-0" />
      </header>

      <div className="flex-1 flex flex-col gap-6">
        {step === 1 && <AmountStep {...props} />}
        {step === 2 && <PayerStep {...props} />}
        {step === 3 && <SplitStep {...props} />}
        {step === 4 && <ConfirmStep {...props} />}
      </div>

      {errorMessage && (
        <p role="alert" className="text-body-sm text-negative-text text-center">
          {errorMessage}
        </p>
      )}

      <Button
        type="button"
        size="lg"
        width="full"
        loading={isSubmitting}
        disabled={!canGoNext}
        onClick={onNext}
      >
        {step === 4 ? "ثبت خرج" : "ادامه"}
      </Button>
    </div>
  );
}

function AmountStep({ amount, onDigit, onTripleZero, onBackspace }: CreateExpenseViewProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-display-md font-bold text-text tabular-nums tracking-tight">
        {formatToman(amount)}
      </p>
      <div className="w-full max-w-sm">
        <Numpad onDigit={onDigit} onTripleZero={onTripleZero} onBackspace={onBackspace} />
      </div>
    </div>
  );
}

function PayerStep({
  amount,
  payerOptions,
  payerId,
  onPayerChange,
  description,
  onDescriptionChange,
  selectedCategoryId,
  onCategoryClick,
}: CreateExpenseViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-center text-h4 font-semibold text-text tabular-nums">
        {formatToman(amount)}
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-label-md font-medium text-text">پرداخت‌کننده</h2>
        <PayerSelector options={payerOptions} value={payerId} onChange={onPayerChange} />
      </section>

      <section className="flex flex-col gap-3">
        <Input
          label="برای چی؟"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="پیتزا، اسنپ، …"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c.id}
              label={c.label}
              icon={c.icon}
              selected={selectedCategoryId === c.id}
              onClick={() => onCategoryClick(c.id, c.label)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SplitStep({
  splitMethod,
  onSplitMethodChange,
  participantOptions,
  selectedParticipantIds,
  onToggleParticipant,
  perPersonAmount,
}: CreateExpenseViewProps) {
  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl<SplitMethodT>
        value={splitMethod}
        onChange={onSplitMethodChange}
        options={[
          { value: SplitMethod.EQUAL,      label: "مساوی" },
          { value: SplitMethod.EXACT,      label: "دستی" },
          { value: SplitMethod.PERCENTAGE, label: "درصدی" },
        ]}
      />
      {splitMethod !== SplitMethod.EQUAL && (
        <p className="text-body-xs text-text-muted text-center">
          فعلاً فقط تقسیم «مساوی» در دسترس است.
        </p>
      )}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-label-md font-medium text-text">هر نفر می‌ده</h2>
        <span className="text-body-xs text-text-muted">
          {toFarsi(selectedParticipantIds.size)} نفر
        </span>
      </div>
      <ParticipantsToggleList
        options={participantOptions}
        selectedIds={selectedParticipantIds}
        onToggle={onToggleParticipant}
        getRowTrailing={(id, selected) =>
          selected ? formatToman(perPersonAmount(id)) : "—"
        }
      />
    </div>
  );
}

function ConfirmStep({
  amount,
  description,
  payerOptions,
  payerId,
  ledgerName,
  splitSummary,
  expenseDateLabel,
}: CreateExpenseViewProps) {
  const payer = payerOptions.find((u) => u.id === payerId);
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <p className="text-h4 font-semibold text-text">{description || "بدون توضیح"}</p>
        <p className="mt-1 text-display-sm font-bold tabular-nums tracking-tight">
          {formatToman(amount)}
        </p>
      </div>

      <GlassCard padding="lg" radius="xl">
        <dl className="grid grid-cols-2 gap-y-3 text-body-sm">
          <dt className="text-text-muted">پرداخت‌کننده</dt>
          <dd className="text-end font-medium text-text">{payer?.fullName ?? "—"}</dd>

          <dt className="text-text-muted">تقسیم</dt>
          <dd className="text-end font-medium text-text">{splitSummary}</dd>

          <dt className="text-text-muted">دفترچه</dt>
          <dd className="text-end font-medium text-text">{ledgerName}</dd>

          <dt className="text-text-muted">تاریخ</dt>
          <dd className="text-end font-medium text-text">{expenseDateLabel}</dd>
        </dl>
      </GlassCard>
    </div>
  );
}
