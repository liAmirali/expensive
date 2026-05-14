import { createFileRoute } from "@tanstack/react-router";
import { CreateLedgerContainer } from "@/components/containers/CreateLedgerContainer";

export const Route = createFileRoute("/_app/groups/$groupId/ledgers/new")({
  component: CreateLedgerContainer,
});
