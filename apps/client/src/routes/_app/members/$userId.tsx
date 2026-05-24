import { createFileRoute } from "@tanstack/react-router";
import { MemberDetailContainer } from "@/components/containers/MemberDetailContainer";

export const Route = createFileRoute("/_app/members/$userId")({
  component: MemberDetailContainer,
});
