import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  groupControllerCreateGroup,
  groupControllerFindAll,
  groupControllerFindOne,
  getGroupControllerFindAllQueryKey,
  getGroupControllerFindOneQueryKey,
} from "@/api/generated/groups/groups";
import type { CreateGroupDto, GroupDTO } from "@/api/generated/schemas";

export const useGroupsQuery = (
  options?: Omit<UseQueryOptions<GroupDTO[]>, "queryKey" | "queryFn">,
) =>
  useQuery<GroupDTO[]>({
    queryKey: getGroupControllerFindAllQueryKey(),
    queryFn: ({ signal }) => groupControllerFindAll(signal),
    ...options,
  });

export const useCreateGroupMutation = (
  options?: UseMutationOptions<GroupDTO, unknown, CreateGroupDto>,
) =>
  useMutation<GroupDTO, unknown, CreateGroupDto>({
    mutationFn: (body) => groupControllerCreateGroup(body),
    ...options,
  });

export const useGroupQuery = (
  groupId: string,
  options?: Omit<UseQueryOptions<GroupDTO>, "queryKey" | "queryFn">,
) =>
  useQuery<GroupDTO>({
    queryKey: getGroupControllerFindOneQueryKey(groupId),
    queryFn: ({ signal }) => groupControllerFindOne(groupId, signal),
    ...options,
  });
