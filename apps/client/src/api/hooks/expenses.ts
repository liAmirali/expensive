import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { expensesControllerCreateExpense } from "@/api/generated/expenses/expenses";
import type { CreateExpenseDto } from "@/api/generated/schemas";

export const useCreateExpenseMutation = (
  ledgerId: string,
  options?: UseMutationOptions<void, unknown, CreateExpenseDto>,
) =>
  useMutation<void, unknown, CreateExpenseDto>({
    mutationFn: (body) => expensesControllerCreateExpense(ledgerId, body),
    ...options,
  });
