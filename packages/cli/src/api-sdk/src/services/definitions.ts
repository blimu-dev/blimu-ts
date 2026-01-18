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
   * GET /v1/workspace/{workspaceId}/environments/{environmentId}/definitions/openapi*
   * @summary Generate OpenAPI spec from database definitions*
   * @description Generates a custom OpenAPI specification from the environment's stored definitions in the database. The generated spec can be used to create type-safe SDKs.*/
  getOpenApi(
    workspaceId: string,
    environmentId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.DefinitionGenerateSDKResponseDto_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/definitions/openapi`,
      ...(init || {}),
    });
  }

  /**
   * POST /v1/workspace/{workspaceId}/environments/{environmentId}/definitions/openapi*
   * @summary Generate custom openapi spec based on the environment definitions*
   * @description Validates configuration and generates a custom OpenAPI specification tailored to the user's resource definitions. The generated spec can be used to create type-safe SDKs.*/
  createOpenApi(
    workspaceId: string,
    environmentId: string,
    body: Schema.DefinitionGenerateSDKRequestDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.DefinitionGenerateSDKResponseDto_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspace/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/definitions/openapi`,
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
