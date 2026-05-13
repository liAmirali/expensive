import { createFileRoute } from "@tanstack/react-router";
import { HomeContainer } from "@/components/containers/HomeContainer";

export const Route = createFileRoute("/_app/home")({
  component: HomeContainer,
});
