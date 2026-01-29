import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';

export class ResourcesService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/resources*
   * @summary List resources for an environment*/
  list(
    workspaceId: string,
    environmentId: string,
    query?: Schema.ResourcesListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ResourceListResponseDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/resources`,
      query,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspaces/{workspaceId}/environments/{environmentId}/resources*
   * @summary Create a new resource*/
  create(
    workspaceId: string,
    environmentId: string,
    body: Schema.ResourceCreateDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ResourceDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/resources`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * DELETE /v1/workspaces/{workspaceId}/environments/{environmentId}/resources/{resourceType}/{resourceId}*
   * @summary Delete a resource*/
  delete(
    workspaceId: string,
    environmentId: string,
    resourceType: string,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/resources/{resourceType}/{resourceId}*
   * @summary Get a specific resource*/
  get(
    workspaceId: string,
    environmentId: string,
    resourceType: string,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ResourceDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      ...(init ?? {}),
    });
  }

  /**
   * PUT /v1/workspaces/{workspaceId}/environments/{environmentId}/resources/{resourceType}/{resourceId}*
   * @summary Update a resource*/
  update(
    workspaceId: string,
    environmentId: string,
    resourceType: string,
    resourceId: string,
    body: Schema.ResourceUpdateDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ResourceDto_Output> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/resources/{resourceType}/{resourceId}/children*
   * @summary List children resources for a specific resource*/
  listChildren(
    workspaceId: string,
    environmentId: string,
    resourceType: string,
    resourceId: string,
    query?: Schema.ResourcesListChildrenQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ResourceListResponseDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/children`,
      query,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/resources/{resourceType}/{resourceId}/users*
   * @summary Get users with roles on a resource*/
  getResourceUsers(
    workspaceId: string,
    environmentId: string,
    resourceType: string,
    resourceId: string,
    query?: Schema.ResourcesGetResourceUsersQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ResourceUserListResponseDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/users`,
      query,
      ...(init ?? {}),
    });
  }
}
