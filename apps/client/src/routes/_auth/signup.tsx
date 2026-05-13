import { createFileRoute } from "@tanstack/react-router";
import { SignUpContainer } from "@/components/containers/SignUpContainer";

export const Route = createFileRoute("/_auth/signup")({
  component: SignUpContainer,
});
