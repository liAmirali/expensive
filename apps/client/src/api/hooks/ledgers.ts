import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  ledgersControllerCreateLedger,
  ledgersControllerListLedgers,
  ledgersControllerGetLedger,
  getLedgersControllerListLedgersQueryKey,
  getLedgersControllerGetLedgerQueryKey,
} from "@/api/generated/ledgers/ledgers";
import type { CreateLedgerDto, LedgerDto } from "@/api/generated/schemas";

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
