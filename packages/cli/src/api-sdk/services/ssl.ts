import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';

export class SslService {
  constructor(private core: FetchClient) {}

  /**
   * POST /v1/workspaces/{workspaceId}/environments/{environmentId}/ssl/provision*
   * @summary Provision custom domains and SSL certificates for an environment*/
  provision(
    workspaceId: string,
    environmentId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.CustomHostnameListDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/ssl/provision`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/ssl/status*
   * @summary Get SSL certificate status for an environment*/
  getStatus(
    workspaceId: string,
    environmentId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.SslStatusResponseDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/ssl/status`,
      ...(init ?? {}),
    });
  }
}
