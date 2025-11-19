import { CoreClient } from '../client';
import * as Schema from '../schema';

export class ResourcesService {
  constructor(private core: CoreClient) {}

  /**
   * GET /v1/resources/{resourceType}
   * @summary List resources
   */
  list(
    resourceType: Schema.ResourceType,
    query?: Schema.ResourcesListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.ResourceList> {
    return this.core.request({
      method: 'GET',
      path: `/v1/resources/${encodeURIComponent(resourceType)}`,
      query,
      ...(init || {}),
    });
  }

  /**
   * POST /v1/resources/{resourceType}
   * @summary Bulk create resources
   */
  bulkCreate(
    resourceType: Schema.ResourceType,
    body: Schema.ResourceBulkCreateBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.ResourceBulkResult> {
    return this.core.request({
      method: 'POST',
      path: `/v1/resources/${encodeURIComponent(resourceType)}`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }

  /**
   * DELETE /v1/resources/{resourceType}/{resourceId}
   * @summary Delete a resource
   */
  delete(
    resourceType: Schema.ResourceType,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      ...(init || {}),
    });
  }

  /**
   * GET /v1/resources/{resourceType}/{resourceId}
   * @summary Read a resource
   */
  read(
    resourceType: Schema.ResourceType,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.Resource> {
    return this.core.request({
      method: 'GET',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      ...(init || {}),
    });
  }

  /**
   * PUT /v1/resources/{resourceType}/{resourceId}
   * @summary Update a resource
   */
  update(
    resourceType: Schema.ResourceType,
    resourceId: string,
    body: Schema.ResourceUpdateBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<unknown> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }
}
