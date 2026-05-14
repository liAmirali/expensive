import { createFileRoute } from "@tanstack/react-router";
import { GroupDetailContainer } from "@/components/containers/GroupDetailContainer";

export const Route = createFileRoute("/_app/groups/$groupId/")({
  component: GroupDetailContainer,
});
