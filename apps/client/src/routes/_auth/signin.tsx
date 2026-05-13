import { createFileRoute } from "@tanstack/react-router";
import { SignInContainer } from "@/components/containers/SignInContainer";

export const Route = createFileRoute("/_auth/signin")({
  component: SignInContainer,
});
