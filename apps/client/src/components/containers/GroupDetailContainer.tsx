import { useNavigate, useParams } from "@tanstack/react-router";
import { GroupDetailView } from "@/components/views/GroupDetailView";
import { useGroupQuery } from "@/api/hooks/groups";
import { useLedgersListQuery } from "@/api/hooks/ledgers";
import type { LedgerDto } from "@/api/generated/schemas";
import type { LedgersListItem } from "@/components/composite/LedgersList";
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

  const error =
    groupQ.isError
      ? extractError(groupQ.error)
      : ledgersQ.isError
      ? extractError(ledgersQ.error)
      : undefined;

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
              to: "/groups/$groupId/ledgers/$ledgerId/expenses/new",
              params: { groupId, ledgerId: l.id },
            }),
          ),
        ) ?? []
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
