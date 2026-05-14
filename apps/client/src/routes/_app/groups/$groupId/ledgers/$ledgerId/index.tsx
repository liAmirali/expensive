import { createFileRoute } from "@tanstack/react-router";
import { LedgerDetailContainer } from "@/components/containers/LedgerDetailContainer";

export const Route = createFileRoute("/_app/groups/$groupId/ledgers/$ledgerId/")({
  component: LedgerDetailContainer,
});