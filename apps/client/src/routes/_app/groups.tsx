import { createFileRoute } from "@tanstack/react-router";
import { GroupsContainer } from "@/components/containers/GroupsContainer";

export const Route = createFileRoute("/_app/groups")({
  component: GroupsContainer,
});
