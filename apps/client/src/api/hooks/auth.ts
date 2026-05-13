import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  authControllerLogin,
  authControllerRegisterUser,
  authControllerRefresh,
} from "@/api/generated/authentication/authentication";
import type {
  AuthTokensDto,
  LoginBodyDto,
  RefreshBodyDto,
  RegisterBodyDto,
} from "@/api/generated/schemas";

export const useLoginMutation = (
  options?: UseMutationOptions<AuthTokensDto, unknown, LoginBodyDto>,
) =>
  useMutation<AuthTokensDto, unknown, LoginBodyDto>({
    mutationFn: (body) => authControllerLogin(body),
    ...options,
  });

export const useRegisterMutation = (
  options?: UseMutationOptions<AuthTokensDto, unknown, RegisterBodyDto>,
) =>
  useMutation<AuthTokensDto, unknown, RegisterBodyDto>({
    mutationFn: (body) => authControllerRegisterUser(body),
    ...options,
  });

export const useRefreshMutation = (
  options?: UseMutationOptions<AuthTokensDto, unknown, RefreshBodyDto>,
) =>
  useMutation<AuthTokensDto, unknown, RefreshBodyDto>({
    mutationFn: (body) => authControllerRefresh(body),
    ...options,
  });
