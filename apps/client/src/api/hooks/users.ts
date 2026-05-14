import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  userControllerMe,
  userControllerSearch,
  getUserControllerMeQueryKey,
  getUserControllerSearchQueryKey,
} from "@/api/generated/users/users";
import type { MeDTO, UserPublicDTO } from "@/api/generated/schemas";

export const useMeQuery = (
  options?: Omit<UseQueryOptions<MeDTO>, "queryKey" | "queryFn">,
) =>
  useQuery<MeDTO>({
    queryKey: getUserControllerMeQueryKey(),
    queryFn: ({ signal }) => userControllerMe(signal),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useUserSearchQuery = (
  q: string,
  options?: Omit<UseQueryOptions<UserPublicDTO[]>, "queryKey" | "queryFn">,
) =>
  useQuery<UserPublicDTO[]>({
    queryKey: getUserControllerSearchQueryKey({ q }),
    queryFn: ({ signal }) => userControllerSearch({ q }, signal),
    ...options,
  });
