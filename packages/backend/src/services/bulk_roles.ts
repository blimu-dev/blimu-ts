import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';

export class BulkRolesService {
  constructor(private core: FetchClient) {}

  /**
   * POST /v1/users/roles/bulk*
   * @summary Bulk create roles*
   * @description Assigns multiple roles to users on resources in a single request. This operation supports partial success - some role assignments may succeed while others fail. The response includes details about successful assignments and any errors encountered. All roles must be valid according to your resource definitions.*/
  create(
    body: Schema.RoleBulkCreateBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.RoleBulkResult> {
    return this.core.request({
      method: 'POST',
      path: `/v1/users/roles/bulk`,
      body,
      ...(init ?? {}),
    });
  }
}
