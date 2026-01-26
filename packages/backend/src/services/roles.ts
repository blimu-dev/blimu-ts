import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';
import type { ResourceType } from '@blimu/types';

export class RolesService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/users/{userId}/roles*
   * @summary List user roles*
   * @description Retrieves a paginated list of roles assigned to a user. Supports filtering by resource type, resource ID, and role name. Returns both directly assigned roles and inherited roles.*/
  list(
    userId: string,
    query?: Schema.RolesListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.RoleList> {
    return this.core.request({
      method: 'GET',
      path: `/v1/users/${encodeURIComponent(userId)}/roles`,
      query,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/users/{userId}/roles*
   * @summary Create a role (assign role to user on resource)*
   * @description Assigns a role to a user on a specific resource. The role must be defined in your resource definitions for the specified resource type. Roles can be inherited from parent resources based on your resource configuration.*/
  create(
    userId: string,
    body: Schema.RoleCreateBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.Role> {
    return this.core.request({
      method: 'POST',
      path: `/v1/users/${encodeURIComponent(userId)}/roles`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * DELETE /v1/users/{userId}/roles/{resourceType}/{resourceId}*
   * @summary Delete a role*
   * @description Removes a role assignment from a user on a specific resource. This only removes the direct role assignment and does not affect inherited roles from parent resources.*/
  delete(
    userId: string,
    resourceType: ResourceType,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/users/${encodeURIComponent(userId)}/roles/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      ...(init ?? {}),
    });
  }
}
