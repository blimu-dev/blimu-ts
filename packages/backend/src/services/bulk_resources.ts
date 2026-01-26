import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';
import type { ResourceType } from '@blimu/types';

export class BulkResourcesService {
  constructor(private core: FetchClient) {}

  /**
   * POST /v1/resources/{resourceType}/bulk*
   * @summary Bulk create resources*
   * @description Creates multiple resources of the specified type in a single request. This operation supports partial success - some resources may be created while others fail. The response includes details about successful creations and any errors encountered. Resources can have parent relationships and initial role assignments.*/
  create(
    resourceType: ResourceType,
    body: Schema.ResourceBulkCreateBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ResourceBulkResult> {
    return this.core.request({
      method: 'POST',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/bulk`,
      body,
      ...(init ?? {}),
    });
  }
}
