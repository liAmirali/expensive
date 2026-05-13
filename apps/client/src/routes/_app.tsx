import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { getAccessToken } from "@/utils/authToken";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (!getAccessToken()) {
      throw redirect({ to: "/signin" });
    }
  },
  component: AppLayout,
});
