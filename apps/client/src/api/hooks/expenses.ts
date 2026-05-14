import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  expensesControllerCreateExpense,
  expensesControllerListExpenses,
  getExpensesControllerListExpensesQueryKey,
} from "@/api/generated/expenses/expenses";
import type { CreateExpenseDto, ExpenseResponseDto } from "@/api/generated/schemas";

export const useExpensesListQuery = (
  ledgerId: string,
  options?: Omit<UseQueryOptions<ExpenseResponseDto[]>, "queryKey" | "queryFn">,
) =>
  useQuery<ExpenseResponseDto[]>({
    queryKey: getExpensesControllerListExpensesQueryKey(ledgerId),
    queryFn: ({ signal }) => expensesControllerListExpenses(ledgerId, signal),
    ...options,
  });

export const useCreateExpenseMutation = (
  ledgerId: string,
  options?: UseMutationOptions<void, unknown, CreateExpenseDto>,
) =>
  useMutation<void, unknown, CreateExpenseDto>({
    mutationFn: (body) => expensesControllerCreateExpense(ledgerId, body),
    ...options,
  });
