import { CoreClient } from '../client';
import { Schema } from '../schema';

export class UsersService {
  constructor(private core: CoreClient) {}

  /**
   * GET /v1/users
   * @summary List users
   */
  list(
    query?: Schema.UsersListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.UserList> {
    return this.core.request({
      method: 'GET',
      path: `/v1/users`,
      query,
      ...(init || {}),
    });
  }

  /**
   * POST /v1/users
   * @summary Create a user
   */
  create(
    body: Schema.UserCreateBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.User> {
    return this.core.request({
      method: 'POST',
      path: `/v1/users`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }

  /**
   * DELETE /v1/users/{userId}
   * @summary Delete a user
   */
  delete(userId: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/users/${encodeURIComponent(userId)}`,
      ...(init || {}),
    });
  }

  /**
   * GET /v1/users/{userId}
   * @summary Get a user by ID
   */
  read(userId: string, init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.User> {
    return this.core.request({
      method: 'GET',
      path: `/v1/users/${encodeURIComponent(userId)}`,
      ...(init || {}),
    });
  }

  /**
   * PUT /v1/users/{userId}
   * @summary Update a user
   */
  update(
    userId: string,
    body: Schema.UserUpdateBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.User> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/users/${encodeURIComponent(userId)}`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }

  /**
   * GET /v1/users/{userId}/effective-user-resources-roles
   * @summary List effective user resources roles
   */
  listEffectiveUserResourcesRoles(
    userId: string,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.UserResourceList> {
    return this.core.request({
      method: 'GET',
      path: `/v1/users/${encodeURIComponent(userId)}/effective-user-resources-roles`,
      ...(init || {}),
    });
  }
}
