import { useNavigate } from "@tanstack/react-router";
import { GroupsView } from "@/components/views/GroupsView";
import type { GroupsListItem } from "@/components/composite/GroupsList";
import { useGroupsQuery } from "@/api/hooks/groups";
import type { GroupDTO } from "@/api/generated/schemas";
import { extractApiError } from "@/utils/apiError";

const ACCENTS: GroupsListItem["accent"][] = ["violet", "teal", "cerise", "sand", "ink"];

const pickAccent = (id: string): GroupsListItem["accent"] => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
};

const toItem = (g: GroupDTO, onClick: () => void): GroupsListItem => ({
  id: g.id,
  name: g.name,
  description: g.description ?? undefined,
  memberCount: g.members?.length ?? 0,
  accent: pickAccent(g.id),
  onClick,
});

const extractError = (err: unknown) =>
  extractApiError(err, "خطا در دریافت گروه‌ها. دوباره تلاش کنید.");

export function GroupsContainer() {
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useGroupsQuery();

  return (
    <GroupsView
      groups={
        data?.map((g) =>
          toItem(g, () => navigate({ to: "/groups/$groupId", params: { groupId: g.id } })),
        ) ?? []
      }
      isLoading={isPending}
      errorMessage={isError ? extractError(error) : undefined}
      onCreateGroupClick={() => navigate({ to: "/groups/new" })}
    />
  );
}
