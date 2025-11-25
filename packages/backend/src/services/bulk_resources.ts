import { CoreClient } from '../client';
import * as Schema from '../schema';

export class BulkResourcesService {
  constructor(private core: CoreClient) {}

  /**
   * POST /v1/resources/{resourceType}/bulk
   * @summary Bulk create resources
   */
  create(
    resourceType: Schema.ResourceType,
    body: Schema.ResourceBulkCreateBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.ResourceBulkResult> {
    return this.core.request({
      method: 'POST',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/bulk`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }
}
