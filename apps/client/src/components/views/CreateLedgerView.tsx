import { ChevronRight, Lock, Users } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  ParticipantsToggleList,
  type ParticipantsToggleOption,
} from "@/components/composite/ParticipantsToggleList";
import { LedgerVisibility } from "@/api/generated/schemas";

const schema = z.object({
  name:        z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(80, "نام بسیار طولانی است"),
  description: z.string().max(500, "حداکثر ۵۰۰ کاراکتر مجاز است").optional(),
  visibility:  z.enum([LedgerVisibility.PRIVATE_TO_PARTICIPANTS, LedgerVisibility.VISIBLE_TO_GROUP]),
});

export type CreateLedgerFormValues = z.infer<typeof schema>;

export interface CreateLedgerSubmitValues {
  name: string;
  description?: string;
  visibility: LedgerVisibility;
  participantIds: string[];
}

export interface CreateLedgerViewProps {
  groupName: string;
  participantOptions: ParticipantsToggleOption[];
  selectedParticipantIds: Set<string>;
  onToggleParticipant: (id: string) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (values: CreateLedgerSubmitValues) => void;
  onBack?: () => void;
}

export function CreateLedgerView({
  groupName,
  participantOptions,
  selectedParticipantIds,
  onToggleParticipant,
  isSubmitting,
  errorMessage,
  onSubmit,
  onBack,
}: CreateLedgerViewProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CreateLedgerFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      description: "",
      visibility: LedgerVisibility.PRIVATE_TO_PARTICIPANTS,
    },
  });

  const visibility = useWatch({ control, name: "visibility" });
  const isPublic = visibility === LedgerVisibility.VISIBLE_TO_GROUP;

  const submit = (values: CreateLedgerFormValues) =>
    onSubmit({
      name: values.name,
      description: values.description || undefined,
      visibility: values.visibility,
      participantIds: isPublic ? [] : Array.from(selectedParticipantIds),
    });

  const noParticipants = !isPublic && selectedParticipantIds.size === 0;

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6 animate-fade-in" noValidate>
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
          <h1 className="truncate text-h3 font-bold text-text">دفتر جدید</h1>
          <p className="truncate text-body-xs text-text-muted">در {groupName}</p>
        </div>
        <div className="size-10 shrink-0" />
      </header>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            {...field}
            label="نام دفتر"
            placeholder="مثلاً هزینه‌های هتل"
            error={errors.name?.message}
            autoComplete="off"
          />
        )}
      />

      <Textarea
        label="توضیحات (اختیاری)"
        placeholder="توضیح کوتاهی درباره دفتر…"
        error={errors.description?.message}
        {...register("description")}
      />

      <Controller
        control={control}
        name="visibility"
        render={({ field }) => (
          <SegmentedControl
            label="دیده‌شدن"
            value={field.value}
            onChange={field.onChange}
            options={[
              {
                value: LedgerVisibility.PRIVATE_TO_PARTICIPANTS,
                label: "خصوصی",
                icon: <Lock size={14} />,
              },
              {
                value: LedgerVisibility.VISIBLE_TO_GROUP,
                label: "همه گروه",
                icon: <Users size={14} />,
              },
            ]}
          />
        )}
      />

      <p className="text-body-xs text-text-muted leading-relaxed">
        {isPublic
          ? "دفتر عمومی برای همهٔ اعضای گروه قابل مشاهده است، حتی اعضایی که بعداً اضافه می‌شوند."
          : "دفتر خصوصی فقط برای شرکت‌کنندگان انتخاب‌شدهٔ دفتر قابل مشاهده است."}
      </p>

      {!isPublic && (
        <section className="flex flex-col gap-3">
          <header className="flex items-center justify-between">
            <h2 className="text-label-md font-medium text-text">شرکت‌کنندگان</h2>
            <span className="text-body-xs text-text-muted">
              {selectedParticipantIds.size} از {participantOptions.length}
            </span>
          </header>
          <ParticipantsToggleList
            options={participantOptions}
            selectedIds={selectedParticipantIds}
            onToggle={onToggleParticipant}
          />
        </section>
      )}

      {errorMessage && (
        <p role="alert" className="text-body-sm text-negative-text text-center">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        width="full"
        loading={isSubmitting}
        disabled={!isValid || noParticipants}
      >
        ساخت دفتر
      </Button>
    </form>
  );
}
