import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  userControllerGetUser,
  userControllerMe,
  userControllerSearch,
  userControllerUpdateMe,
  getUserControllerGetUserQueryKey,
  getUserControllerMeQueryKey,
  getUserControllerSearchQueryKey,
} from "@/api/generated/users/users";
import type { MeDTO, UpdateMeDto, UserPublicDTO } from "@/api/generated/schemas";

export const useMeQuery = (
  options?: Omit<UseQueryOptions<MeDTO>, "queryKey" | "queryFn">,
) =>
  useQuery<MeDTO>({
    queryKey: getUserControllerMeQueryKey(),
    queryFn: ({ signal }) => userControllerMe(signal),
    staleTime: 5 * 60_000,
    ...options,
  });

export const useUpdateMeMutation = (
  options?: UseMutationOptions<MeDTO, unknown, UpdateMeDto>,
) => {
  const qc = useQueryClient();
  return useMutation<MeDTO, unknown, UpdateMeDto>({
    mutationFn: (body) => userControllerUpdateMe(body),
    onSuccess: (data, variables, context) => {
      qc.setQueryData(getUserControllerMeQueryKey(), data);
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUserQuery = (
  userId: string,
  options?: Omit<UseQueryOptions<UserPublicDTO>, "queryKey" | "queryFn">,
) =>
  useQuery<UserPublicDTO>({
    queryKey: getUserControllerGetUserQueryKey(userId),
    queryFn: ({ signal }) => userControllerGetUser(userId, signal),
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
