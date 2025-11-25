import { CoreClient } from '../client';
import * as Schema from '../schema';

export class BulkRolesService {
  constructor(private core: CoreClient) {}

  /**
   * POST /v1/users/roles/bulk
   * @summary Bulk create roles
   */
  create(
    body: Schema.RoleBulkCreateBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.RoleBulkResult> {
    return this.core.request({
      method: 'POST',
      path: `/v1/users/roles/bulk`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }
}
