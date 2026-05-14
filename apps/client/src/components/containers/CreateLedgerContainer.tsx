import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  CreateLedgerView,
  type CreateLedgerSubmitValues,
} from "@/components/views/CreateLedgerView";
import type { ParticipantsToggleOption } from "@/components/composite/ParticipantsToggleList";
import { useGroupQuery } from "@/api/hooks/groups";
import { useCreateLedgerMutation } from "@/api/hooks/ledgers";
import { useMeQuery } from "@/api/hooks/users";
import { getLedgersControllerListLedgersQueryKey } from "@/api/generated/ledgers/ledgers";
import { GroupMembershipStatus } from "@/api/generated/schemas";
import { extractApiError } from "@/utils/apiError";

export function CreateLedgerContainer() {
  const { groupId } = useParams({ from: "/_app/groups/$groupId/ledgers/new" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const meQ = useMeQuery();
  const groupQ = useGroupQuery(groupId);

  const myId = meQ.data?.id;

  const participantOptions: ParticipantsToggleOption[] =
    groupQ.data?.members
      ?.filter((m) => m.status === GroupMembershipStatus.ACTIVE)
      .map((m) => ({
        id: m.user.id,
        fullName: m.user.fullName,
        email: m.user.email,
        locked: m.user.id === myId,
      })) ?? [];

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (myId) {
      setSelectedIds((prev) => {
        if (prev.has(myId)) return prev;
        const next = new Set(prev);
        next.add(myId);
        return next;
      });
    }
  }, [myId]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const createMutation = useCreateLedgerMutation(groupId, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getLedgersControllerListLedgersQueryKey(groupId),
      });
      navigate({ to: "/groups/$groupId", params: { groupId } });
    },
  });

  const handleSubmit = (values: CreateLedgerSubmitValues) => {
    createMutation.mutate({
      name: values.name,
      description: values.description,
      visibility: values.visibility,
      participants: values.participantIds.map((userId) => ({ userId })),
    });
  };

  return (
    <CreateLedgerView
      groupName={groupQ.data?.name ?? ""}
      participantOptions={participantOptions}
      selectedParticipantIds={selectedIds}
      onToggleParticipant={handleToggle}
      isSubmitting={createMutation.isPending}
      errorMessage={createMutation.isError ? extractApiError(createMutation.error, "خطا در ساخت دفتر. دوباره تلاش کنید.") : undefined}
      onSubmit={handleSubmit}
      onBack={() => navigate({ to: "/groups/$groupId", params: { groupId } })}
    />
  );
}
