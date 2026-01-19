import { useCallback, useEffect, useState } from 'react';

import { useBlimu } from '../providers';

export interface ResourceMember {
  userId: string;
  role: string;
  inherited: boolean;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
  };
}

export interface UseMembersOptions {
  resourceType: string;
  resourceId: string;
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  enabled?: boolean | undefined;
}

export interface UseMembersResult {
  members: ResourceMember[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Hook to fetch and manage members list for a resource
 *
 * @example
 * ```tsx
 * const { members, isLoading, error } = useMembers({
 *   resourceType: 'organization',
 *   resourceId: 'org_123',
 *   page: 1,
 *   limit: 20,
 * });
 * ```
 */
export function useMembers({
  resourceType,
  resourceId,
  page = 1,
  limit = 20,
  search = '',
  enabled = true,
}: UseMembersOptions): UseMembersResult {
  const { client } = useBlimu();
  const [members, setMembers] = useState<ResourceMember[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!enabled || !resourceType || !resourceId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement when resourceMembers API is available in runtime client
      // For now, this is a placeholder that will need to be implemented
      // when the runtime client exposes the resourceMembers service
      const runtimeClient = client.getClient();

      // This will need to be implemented when the API is available
      // const response = await runtimeClient.resourceMembers.list(resourceType, resourceId, {
      //   page,
      //   limit,
      //   search,
      // });

      // Placeholder response
      const response = {
        items: [],
        total: 0,
        page,
        limit,
      };

      setMembers(response.items);
      setTotal(response.total);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch members');
      setError(error);
      setMembers([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [client, resourceType, resourceId, page, limit, search, enabled]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const hasNextPage = total > page * limit;
  const hasPreviousPage = page > 1;

  return {
    members,
    total,
    page,
    limit,
    isLoading,
    error,
    refetch: fetchMembers,
    hasNextPage,
    hasPreviousPage,
  };
}
