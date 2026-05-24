import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  groupControllerAddMember,
  groupControllerCreateGroup,
  groupControllerFindAll,
  groupControllerFindOne,
  groupControllerRemoveMember,
  getGroupControllerFindAllQueryKey,
  getGroupControllerFindOneQueryKey,
} from "@/api/generated/groups/groups";
import type { AddGroupMemberDto, CreateGroupDto, GroupDTO } from "@/api/generated/schemas";

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

export const useInviteGroupMemberMutation = (
  groupId: string,
  options?: UseMutationOptions<unknown, unknown, AddGroupMemberDto>,
) => {
  const qc = useQueryClient();
  return useMutation<unknown, unknown, AddGroupMemberDto>({
    mutationFn: (body) => groupControllerAddMember(groupId, body),
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: getGroupControllerFindOneQueryKey(groupId) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useRemoveGroupMemberMutation = (
  groupId: string,
  options?: UseMutationOptions<unknown, unknown, string>,
) => {
  const qc = useQueryClient();
  return useMutation<unknown, unknown, string>({
    mutationFn: (userId) => groupControllerRemoveMember(groupId, userId),
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: getGroupControllerFindOneQueryKey(groupId) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
