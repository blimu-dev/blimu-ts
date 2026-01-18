import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';

export class DefinitionsService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/workspace/{workspaceId}/environments/{environmentId}/definitions*
   * @summary Get environment definitions*/
  get(
    workspaceId: string,
    environmentId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.DefinitionDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/definitions`,
      ...(init || {}),
    });
  }

  /**
   * PUT /v1/workspace/{workspaceId}/environments/{environmentId}/definitions*
   * @summary Update environment definitions*/
  update(
    workspaceId: string,
    environmentId: string,
    body: Schema.DefinitionUpdateDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/definitions`,
      body,
      ...(init || {}),
    });
  }

  /**
   * POST /v1/workspace/{workspaceId}/environments/{environmentId}/definitions/validate*
   * @summary Validate Blimu configuration*
   * @description Validates a complete Blimu configuration including resources, entitlements, features, and plans. Returns validation errors and optionally generates an OpenAPI spec if valid.*/
  validate(
    workspaceId: string,
    environmentId: string,
    body: Schema.DefinitionValidateRequestDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.DefinitionValidateResponseDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/definitions/validate`,
      body,
      ...(init || {}),
    });
  }
}
