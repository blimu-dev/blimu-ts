import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';

export class UsersService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/users*
   * @summary List users for an environment*/
  list(
    workspaceId: string,
    environmentId: string,
    query?: Schema.UsersListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.UserListResponseDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/users`,
      query,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/users/{userId}*
   * @summary Get user details by ID*/
  get(
    workspaceId: string,
    environmentId: string,
    userId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.UserDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/users/${encodeURIComponent(userId)}`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/users/{userId}/resources*
   * @summary Get user resource relationships*/
  getUserResources(
    workspaceId: string,
    environmentId: string,
    userId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.UserResourceDto_Output[]> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/users/${encodeURIComponent(userId)}/resources`,
      ...(init ?? {}),
    });
  }
}
