import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { GroupDetailView } from "@/components/views/GroupDetailView";
import {
  useGroupQuery,
  useInviteGroupMemberMutation,
  useRemoveGroupMemberMutation,
} from "@/api/hooks/groups";
import { useLedgersListQuery } from "@/api/hooks/ledgers";
import { useMeQuery, useUserSearchQuery } from "@/api/hooks/users";
import type { LedgerDto, UserPublicDTO } from "@/api/generated/schemas";
import type { LedgersListItem } from "@/components/composite/LedgersList";
import type { MembersListItem } from "@/components/composite/MembersList";
import { extractApiError } from "@/utils/apiError";

const extractError = (err: unknown) =>
  extractApiError(err, "خطا در دریافت اطلاعات. دوباره تلاش کنید.");

const toItem = (l: LedgerDto, onClick: () => void): LedgersListItem => ({
  id: l.id,
  name: l.name,
  description: typeof l.description === "string" ? l.description : undefined,
  visibility: l.visibility,
  closed: !!l.closedAt,
  onClick,
});

export function GroupDetailContainer() {
  const { groupId } = useParams({ from: "/_app/groups/$groupId/" });
  const navigate = useNavigate();

  const groupQ = useGroupQuery(groupId);
  const ledgersQ = useLedgersListQuery(groupId);
  const meQ = useMeQuery();
  const myId = meQ.data?.id;

  const [inviteQuery, setInviteQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const trimmedQuery = inviteQuery.trim();
  const searchQ = useUserSearchQuery(trimmedQuery, {
    enabled: trimmedQuery.length >= 2,
  });

  const inviteMutation = useInviteGroupMemberMutation(groupId, {
    onSuccess: () => setInviteQuery(""),
  });
  const removeMutation = useRemoveGroupMemberMutation(groupId, {
    onSettled: () => setRemovingId(null),
  });

  const myMembership = groupQ.data?.members?.find((m) => m.user.id === myId);
  const canManage = myMembership?.role === "OWNER" || myMembership?.role === "ADMIN";

  const existingIds = new Set(groupQ.data?.members?.map((m) => m.user.id) ?? []);
  const inviteResults: UserPublicDTO[] =
    (searchQ.data ?? []).filter((u) => !existingIds.has(u.id));

  const members: MembersListItem[] =
    groupQ.data?.members?.map((m) => ({
      id: m.user.id,
      fullName: m.user.fullName,
      email: m.user.email,
      role: m.role,
      status: m.status,
      isYou: m.user.id === myId,
      canRemove:
        canManage &&
        m.user.id !== myId &&
        m.role !== "OWNER" &&
        !(myMembership?.role === "ADMIN" && m.role === "ADMIN"),
    })) ?? [];

  const error =
    groupQ.isError
      ? extractError(groupQ.error)
      : ledgersQ.isError
      ? extractError(ledgersQ.error)
      : undefined;

  const handleRemove = (userId: string) => {
    setRemovingId(userId);
    removeMutation.mutate(userId);
  };

  const handleInvite = (user: UserPublicDTO) => {
    inviteMutation.mutate({ userId: user.id });
  };

  return (
    <GroupDetailView
      name={groupQ.data?.name ?? ""}
      memberCount={groupQ.data?.members?.length ?? 0}
      archived={!!groupQ.data?.archivedAt}
      owedToYou={1_240_000}
      youOwe={540_000}
      ledgers={
        ledgersQ.data?.map((l) =>
          toItem(l, () =>
            navigate({
              to: "/groups/$groupId/ledgers/$ledgerId",
              params: { groupId, ledgerId: l.id },
            }),
          ),
        ) ?? []
      }
      members={members}
      onMemberClick={(id) =>
        navigate({ to: "/members/$userId", params: { userId: id } })
      }
      canManageMembers={canManage}
      inviteQuery={inviteQuery}
      onInviteQueryChange={setInviteQuery}
      inviteResults={inviteResults}
      isSearchingInvite={searchQ.isFetching}
      onInviteUser={handleInvite}
      isInviting={inviteMutation.isPending}
      inviteError={
        inviteMutation.isError
          ? extractApiError(inviteMutation.error, "خطا در افزودن عضو.")
          : undefined
      }
      onRemoveMember={handleRemove}
      removingMemberId={removingId}
      removeError={
        removeMutation.isError
          ? extractApiError(removeMutation.error, "خطا در حذف عضو.")
          : undefined
      }
      isLoading={groupQ.isPending || ledgersQ.isPending}
      errorMessage={error}
      onBack={() => navigate({ to: "/groups" })}
      onCreateLedgerClick={() =>
        navigate({ to: "/groups/$groupId/ledgers/new", params: { groupId } })
      }
    />
  );
}
