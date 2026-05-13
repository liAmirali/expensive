import { createFileRoute } from "@tanstack/react-router";
import { SignInView } from "@/components/views/SignInView";

export const Route = createFileRoute("/_auth/signin")({
  component: SignInView,
});
