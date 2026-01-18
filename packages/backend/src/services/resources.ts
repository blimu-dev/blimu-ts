import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';

export class ResourcesService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/resources/{resourceType}*
   * @summary List resources*
   * @description Retrieves a paginated list of resources of the specified type. Supports search and filtering. Resources are returned with their parent relationships and metadata.*/
  list(
    resourceType: string,
    query?: Schema.ResourcesListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ResourceList> {
    return this.core.request({
      method: 'GET',
      path: `/v1/resources/${encodeURIComponent(resourceType)}`,
      query,
      ...(init || {}),
    });
  }

  /**
   * POST /v1/resources/{resourceType}*
   * @summary Create a resource*
   * @description Creates a new resource of the specified type. Resources can have parent relationships to form hierarchies. You can optionally assign initial roles to users when creating the resource. Parent resources must already exist.*/
  create(
    resourceType: string,
    body: Schema.ResourceCreateBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.Resource> {
    return this.core.request({
      method: 'POST',
      path: `/v1/resources/${encodeURIComponent(resourceType)}`,
      body,
      ...(init || {}),
    });
  }

  /**
   * DELETE /v1/resources/{resourceType}/{resourceId}*
   * @summary Delete a resource*
   * @description Deletes a resource by its type and ID. This operation is permanent and cannot be undone. Deleting a resource may affect child resources that depend on it.*/
  delete(
    resourceType: string,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      ...(init || {}),
    });
  }

  /**
   * GET /v1/resources/{resourceType}/{resourceId}*
   * @summary Read a resource*
   * @description Retrieves a single resource by its type and ID. Returns the resource with its parent relationships and metadata.*/
  read(
    resourceType: string,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.Resource> {
    return this.core.request({
      method: 'GET',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      ...(init || {}),
    });
  }

  /**
   * PUT /v1/resources/{resourceType}/{resourceId}*
   * @summary Update a resource*
   * @description Updates an existing resource. You can update the resource name and modify parent relationships. Parent resources must already exist.*/
  update(
    resourceType: string,
    resourceId: string,
    body: Schema.ResourceUpdateBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      body,
      ...(init || {}),
    });
  }
}
