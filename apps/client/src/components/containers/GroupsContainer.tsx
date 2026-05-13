import { isAxiosError } from "axios";
import { GroupsView } from "@/components/views/GroupsView";
import type { GroupsListItem } from "@/components/composite/GroupsList";
import { useGroupsQuery } from "@/api/hooks/groups";
import type { GroupDTO } from "@/api/generated/schemas";

const ACCENTS: GroupsListItem["accent"][] = ["violet", "teal", "cerise", "sand", "ink"];

const pickAccent = (id: string): GroupsListItem["accent"] => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
};

const toItem = (g: GroupDTO): GroupsListItem => ({
  id: g.id,
  name: g.name,
  description: g.description ?? undefined,
  memberCount: g.members?.length ?? 0,
  accent: pickAccent(g.id),
});

const extractError = (err: unknown): string => {
  if (isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] } | undefined;
    const msg = data?.message;
    if (Array.isArray(msg)) return msg[0] ?? "خطا در دریافت گروه‌ها";
    if (typeof msg === "string") return msg;
  }
  return "خطا در دریافت گروه‌ها. دوباره تلاش کنید.";
};

export function GroupsContainer() {
  const { data, isPending, isError, error } = useGroupsQuery();

  return (
    <GroupsView
      groups={data?.map(toItem) ?? []}
      isLoading={isPending}
      errorMessage={isError ? extractError(error) : undefined}
    />
  );
}
