import { createFileRoute } from "@tanstack/react-router";
import { CreateGroupContainer } from "@/components/containers/CreateGroupContainer";

export const Route = createFileRoute("/_app/groups/new")({
  component: CreateGroupContainer,
});
