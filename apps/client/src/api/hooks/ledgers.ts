import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  ledgersControllerAddParticipant,
  ledgersControllerCreateLedger,
  ledgersControllerListLedgers,
  ledgersControllerGetLedger,
  ledgersControllerRemoveParticipant,
  getLedgersControllerListLedgersQueryKey,
  getLedgersControllerGetLedgerQueryKey,
} from "@/api/generated/ledgers/ledgers";
import type {
  AddLedgerParticipantDto,
  CreateLedgerDto,
  LedgerDto,
} from "@/api/generated/schemas";

export const useLedgersListQuery = (
  groupId: string,
  options?: Omit<UseQueryOptions<LedgerDto[]>, "queryKey" | "queryFn">,
) =>
  useQuery<LedgerDto[]>({
    queryKey: getLedgersControllerListLedgersQueryKey(groupId),
    queryFn: ({ signal }) => ledgersControllerListLedgers(groupId, signal),
    ...options,
  });

export const useCreateLedgerMutation = (
  groupId: string,
  options?: UseMutationOptions<LedgerDto, unknown, CreateLedgerDto>,
) =>
  useMutation<LedgerDto, unknown, CreateLedgerDto>({
    mutationFn: (body) => ledgersControllerCreateLedger(groupId, body),
    ...options,
  });

export const useLedgerQuery = (
  ledgerId: string,
  options?: Omit<UseQueryOptions<LedgerDto>, "queryKey" | "queryFn">,
) =>
  useQuery<LedgerDto>({
    queryKey: getLedgersControllerGetLedgerQueryKey(ledgerId),
    queryFn: ({ signal }) => ledgersControllerGetLedger(ledgerId, signal),
    ...options,
  });

export const useAddLedgerParticipantMutation = (
  ledgerId: string,
  options?: UseMutationOptions<unknown, unknown, AddLedgerParticipantDto>,
) => {
  const qc = useQueryClient();
  return useMutation<unknown, unknown, AddLedgerParticipantDto>({
    mutationFn: (body) => ledgersControllerAddParticipant(ledgerId, body),
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: getLedgersControllerGetLedgerQueryKey(ledgerId) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useRemoveLedgerParticipantMutation = (
  ledgerId: string,
  options?: UseMutationOptions<unknown, unknown, string>,
) => {
  const qc = useQueryClient();
  return useMutation<unknown, unknown, string>({
    mutationFn: (userId) => ledgersControllerRemoveParticipant(ledgerId, userId),
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: getLedgersControllerGetLedgerQueryKey(ledgerId) });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
