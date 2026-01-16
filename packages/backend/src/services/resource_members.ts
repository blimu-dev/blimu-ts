import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';

export class ResourceMembersService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/resources/{resourceType}/{resourceId}/members*
   * @summary List members for a resource*
   * @description Retrieves a paginated list of users who have roles (direct or inherited) on the specified resource. Supports search functionality to filter users by email or name.*/
  list(
    resourceType: string,
    resourceId: string,
    query?: Schema.ResourceMembersListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ResourceMemberList> {
    return this.core.request({
      method: 'GET',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/members`,
      query,
      ...(init || {}),
    });
  }
}
