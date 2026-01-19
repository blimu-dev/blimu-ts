import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';

export class DnsService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/dns/records*
   * @summary Get DNS records for an environment*/
  getRecords(
    workspaceId: string,
    environmentId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.DnsRecordListDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/dns/records`,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspaces/{workspaceId}/environments/{environmentId}/dns/validate*
   * @summary Validate DNS records for an environment*/
  validate(
    workspaceId: string,
    environmentId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.DnsRecordListDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/dns/validate`,
      ...(init ?? {}),
    });
  }
}
