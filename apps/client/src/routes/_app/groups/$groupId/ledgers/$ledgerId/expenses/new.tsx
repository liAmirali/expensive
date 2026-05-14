import { createFileRoute } from "@tanstack/react-router";
import { CreateExpenseContainer } from "@/components/containers/CreateExpenseContainer";

export const Route = createFileRoute(
  "/_app/groups/$groupId/ledgers/$ledgerId/expenses/new",
)({
  component: CreateExpenseContainer,
});
