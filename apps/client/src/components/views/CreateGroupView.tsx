import { ChevronRight, ImagePlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { MemberPicker } from "@/components/composite/MemberPicker";
import type { UserPublicDTO } from "@/api/generated/schemas";

const schema = z.object({
  name:        z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(80, "نام بسیار طولانی است"),
  description: z.string().max(500, "حداکثر ۵۰۰ کاراکتر مجاز است").optional(),
});

export type CreateGroupFormValues = z.infer<typeof schema>;

export interface CreateGroupSubmitValues {
  name: string;
  description?: string;
  memberIds: string[];
}

export interface CreateGroupViewProps {
  selectedMembers: UserPublicDTO[];
  onAddMember: (user: UserPublicDTO) => void;
  onRemoveMember: (userId: string) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  searchResults: UserPublicDTO[];
  isSearching?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (values: CreateGroupSubmitValues) => void;
  onBack?: () => void;
}

export function CreateGroupView({
  selectedMembers,
  onAddMember,
  onRemoveMember,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  isSearching,
  isSubmitting,
  errorMessage,
  onSubmit,
  onBack,
}: CreateGroupViewProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CreateGroupFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", description: "" },
  });

  const submit = (values: CreateGroupFormValues) =>
    onSubmit({
      name: values.name,
      description: values.description || undefined,
      memberIds: selectedMembers.map((u) => u.id),
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6 animate-fade-in" noValidate>
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="بازگشت"
          className="flex size-10 items-center justify-center rounded-pill text-text-muted hover:bg-surface hover:text-text transition-colors cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>
        <h1 className="text-h3 font-bold text-text">گروه جدید</h1>
        <div className="size-10" />
      </header>

      <div className="flex justify-center">
        <button
          type="button"
          disabled
          aria-label="افزودن تصویر گروه (به‌زودی)"
          className="relative flex size-24 items-center justify-center rounded-pill bg-bg border border-dashed border-border-strong text-text-subtle"
        >
          <ImagePlus size={28} />
          <span className="absolute -bottom-2 px-2 py-0.5 rounded-pill bg-[var(--p-sand-100)] text-[var(--p-sand-700)] text-overline">
            به‌زودی
          </span>
        </button>
      </div>

      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            {...field}
            label="نام گروه"
            placeholder="مثلاً سفر شمال"
            error={errors.name?.message}
            autoComplete="off"
          />
        )}
      />

      <Textarea
        label="توضیحات (اختیاری)"
        placeholder="توضیح کوتاهی درباره گروه…"
        error={errors.description?.message}
        {...register("description")}
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-label-md font-medium text-text">اعضا</h2>
        <MemberPicker
          query={searchQuery}
          onQueryChange={onSearchQueryChange}
          results={searchResults}
          isSearching={isSearching}
          selected={selectedMembers}
          onAdd={onAddMember}
          onRemove={onRemoveMember}
        />
        <p className="text-body-xs text-text-muted">
          خودتان به‌صورت خودکار به گروه اضافه می‌شوید.
        </p>
      </section>

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
        disabled={!isValid}
      >
        ساخت گروه
      </Button>
    </form>
  );
}
