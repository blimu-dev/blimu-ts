import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';

export class ApiKeysService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/workspace/{workspaceId}/api-keys*
   * @returns List API keys*/
  list(
    workspaceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ApiKeyListDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/api-keys`,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspace/{workspaceId}/api-keys*
   * @returns Create API key*/
  create(
    workspaceId: string,
    body: Schema.ApiKeyCreateDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ApiKeyDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/api-keys`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * DELETE /v1/workspace/{workspaceId}/api-keys/{id}*
   * @returns Delete API key*/
  delete(
    workspaceId: string,
    id: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/api-keys/${encodeURIComponent(id)}`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspace/{workspaceId}/api-keys/{id}*
   * @returns Get API key*/
  get(
    workspaceId: string,
    id: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ApiKeyDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/api-keys/${encodeURIComponent(id)}`,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspace/{workspaceId}/api-keys/{id}/reveal*
   * @returns Reveal API key*/
  reveal(
    workspaceId: string,
    id: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ApiKeyRevealDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/api-keys/${encodeURIComponent(id)}/reveal`,
      ...(init ?? {}),
    });
  }
}
