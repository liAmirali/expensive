import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CreateGroupView, type CreateGroupSubmitValues } from "@/components/views/CreateGroupView";
import { useCreateGroupMutation } from "@/api/hooks/groups";
import { useUserSearchQuery } from "@/api/hooks/users";
import { useDebouncedValue } from "@/utils/useDebouncedValue";
import { getGroupControllerFindAllQueryKey } from "@/api/generated/groups/groups";
import type { UserPublicDTO } from "@/api/generated/schemas";
import { extractApiError } from "@/utils/apiError";

const MIN_QUERY_LENGTH = 2;

const extractError = (err: unknown) =>
  extractApiError(err, "خطا در ساخت گروه. دوباره تلاش کنید.");

export function CreateGroupContainer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<UserPublicDTO[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const searchEnabled = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const searchQ = useUserSearchQuery(debouncedQuery, {
    enabled: searchEnabled,
    staleTime: 30_000,
  });

  const createMutation = useCreateGroupMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGroupControllerFindAllQueryKey() });
      navigate({ to: "/groups" });
    },
  });

  const handleAddMember = (user: UserPublicDTO) => {
    setSelected((prev) => (prev.some((u) => u.id === user.id) ? prev : [...prev, user]));
    setQuery("");
  };

  const handleRemoveMember = (userId: string) => {
    setSelected((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSubmit = (values: CreateGroupSubmitValues) => {
    createMutation.mutate({
      name: values.name,
      description: values.description,
      members: values.memberIds.length > 0 ? values.memberIds : undefined,
    });
  };

  return (
    <CreateGroupView
      selectedMembers={selected}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      searchQuery={query}
      onSearchQueryChange={setQuery}
      searchResults={searchEnabled ? searchQ.data ?? [] : []}
      isSearching={searchEnabled && searchQ.isFetching}
      isSubmitting={createMutation.isPending}
      errorMessage={createMutation.isError ? extractError(createMutation.error) : undefined}
      onSubmit={handleSubmit}
      onBack={() => navigate({ to: "/groups" })}
    />
  );
}
