import { CoreClient } from '../client';
import * as Schema from '../schema';

export class UsersService {
  constructor(private core: CoreClient) {}

  /**
   * GET /v1/users
   * @summary List users
   *
   * @description Retrieves a paginated list of users in your environment. Supports search functionality to filter users by email, name, or lookup key.
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
   *
   * @description Creates a new user in your environment. The lookupKey is a unique identifier that you can use to reference the user in your system. It should be stable and not change over time.
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
   *
   * @description Deletes a user by their ID or lookup key. This operation is permanent and cannot be undone. Deleting a user will also remove all role assignments for that user.
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
   *
   * @description Retrieves a single user by their ID or lookup key. Returns user information including email, name, and metadata.
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
   *
   * @description Updates an existing user. You can modify email, name, and other user properties. The lookupKey can be updated but should remain stable.
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
   *
   * @description Retrieves all resources and roles for a user, including inherited roles from parent resources. The response indicates whether each role is directly assigned or inherited through resource hierarchies.
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
