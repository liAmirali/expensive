import { createFileRoute } from "@tanstack/react-router";
import { SignUpView } from "@/components/views/SignUpView";

export const Route = createFileRoute("/_auth/signup")({
  component: SignUpView,
});
