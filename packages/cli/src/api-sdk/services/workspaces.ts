import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';

export class WorkspacesService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/workspaces*
   * @summary Get all workspaces*/
  list(init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.WorkspaceListDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces`,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspaces*
   * @summary Create a new workspace*/
  create(
    body: Schema.WorkspaceCreateDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.WorkspaceCreateResponseDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspaces`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspaces/{workspaceId}*
   * @summary Get current authenticated workspace*/
  getCurrent(
    workspaceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.WorkspaceDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}`,
      ...(init ?? {}),
    });
  }

  /**
   * PUT /v1/workspaces/{workspaceId}*
   * @summary Update authenticated workspace*/
  update(
    workspaceId: string,
    body: Schema.WorkspaceUpdateDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.WorkspaceDto_Output> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}`,
      body,
      ...(init ?? {}),
    });
  }
}
