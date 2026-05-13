import { createFileRoute } from "@tanstack/react-router";
import { ProfileView } from "@/components/views/ProfileView";

export const Route = createFileRoute("/_app/profile")({
  component: ProfileView,
});
