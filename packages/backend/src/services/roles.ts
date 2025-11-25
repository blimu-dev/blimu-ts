import { CoreClient } from '../client';
import * as Schema from '../schema';

export class RolesService {
  constructor(private core: CoreClient) {}

  /**
   * GET /v1/users/{userId}/roles
   * @summary List user roles
   */
  list(
    userId: string,
    query?: Schema.RolesListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.RoleList> {
    return this.core.request({
      method: 'GET',
      path: `/v1/users/${encodeURIComponent(userId)}/roles`,
      query,
      ...(init || {}),
    });
  }

  /**
   * POST /v1/users/{userId}/roles
   * @summary Create a role (assign role to user on resource)
   */
  create(
    userId: string,
    body: Schema.RoleCreateBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.Role> {
    return this.core.request({
      method: 'POST',
      path: `/v1/users/${encodeURIComponent(userId)}/roles`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }

  /**
   * DELETE /v1/users/{userId}/roles/{resourceType}/{resourceId}
   * @summary Delete a role
   */
  delete(
    userId: string,
    resourceType: Schema.ResourceType,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/users/${encodeURIComponent(userId)}/roles/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      ...(init || {}),
    });
  }
}
