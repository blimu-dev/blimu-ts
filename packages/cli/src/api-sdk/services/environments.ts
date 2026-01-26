import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';

export class EnvironmentsService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/workspace/{workspaceId}/environments*
   * @summary List environments*/
  list(
    workspaceId: string,
    query?: Schema.EnvironmentsListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.EnvironmentListDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments`,
      query,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspace/{workspaceId}/environments*
   * @summary Create a new environment*/
  create(
    workspaceId: string,
    body: Schema.EnvironmentCreateDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.EnvironmentDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * DELETE /v1/workspace/{workspaceId}/environments/{environmentId}*
   * @summary Delete an environment*/
  delete(
    workspaceId: string,
    environmentId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspace/{workspaceId}/environments/{environmentId}*
   * @summary Read an environment by ID*/
  read(
    workspaceId: string,
    environmentId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.EnvironmentWithDefinitionDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}`,
      ...(init ?? {}),
    });
  }

  /**
   * PUT /v1/workspace/{workspaceId}/environments/{environmentId}*
   * @summary Update an environment*/
  update(
    workspaceId: string,
    environmentId: string,
    body: Schema.EnvironmentUpdateDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.EnvironmentDto_Output> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspace/{workspaceId}/environments/{environmentId}/auth-config*
   * @summary Get authentication configuration for environment*/
  getAuthConfig(
    workspaceId: string,
    environmentId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.EnvironmentAuthConfigDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/auth-config`,
      ...(init ?? {}),
    });
  }

  /**
   * PUT /v1/workspace/{workspaceId}/environments/{environmentId}/auth-config*
   * @summary Update authentication configuration for environment*/
  updateAuthConfig(
    workspaceId: string,
    environmentId: string,
    body: Schema.EnvironmentAuthConfigUpdateDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.EnvironmentAuthConfigDto_Output> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/auth-config`,
      body,
      ...(init ?? {}),
    });
  }
}
