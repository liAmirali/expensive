import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAccessToken } from "@/utils/authToken";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: getAccessToken() ? "/home" : "/signin" });
  },
});
