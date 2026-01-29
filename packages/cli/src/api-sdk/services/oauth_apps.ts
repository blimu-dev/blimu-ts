import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';

export class OauthAppsService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/oauth-apps*
   * @summary List OAuth apps*
   * @description Retrieves a paginated list of OAuth apps for the environment. Supports filtering by grant type and active status.*/
  list(
    workspaceId: string,
    environmentId: string,
    query?: Schema.OauthAppsListQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.OAuthAppList_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/oauth-apps`,
      query,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspaces/{workspaceId}/environments/{environmentId}/oauth-apps*
   * @summary Create OAuth app*
   * @description Creates a new OAuth application with client ID, secret (for confidential clients), and RSA key pair for token signing. Returns the client secret only once on creation.*/
  create(
    workspaceId: string,
    environmentId: string,
    body: Schema.OAuthAppCreateBodyDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.OAuthAppCreateResponse_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/oauth-apps`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * DELETE /v1/workspaces/{workspaceId}/environments/{environmentId}/oauth-apps/{id}*
   * @summary Delete OAuth app*
   * @description Deletes an OAuth app by ID. This operation is permanent and will cascade delete related tokens, device codes, and consents.*/
  delete(
    workspaceId: string,
    environmentId: string,
    id: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/oauth-apps/${encodeURIComponent(id)}`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/oauth-apps/{id}*
   * @summary Get OAuth app*
   * @description Retrieves a single OAuth app by ID. Client secret is never returned.*/
  getById(
    workspaceId: string,
    environmentId: string,
    id: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.OAuthApp_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/oauth-apps/${encodeURIComponent(id)}`,
      ...(init ?? {}),
    });
  }

  /**
   * PUT /v1/workspaces/{workspaceId}/environments/{environmentId}/oauth-apps/{id}*
   * @summary Update OAuth app*
   * @description Updates an existing OAuth app. You can update name, scopes, redirect URIs, PKCE requirement, consent requirement, and active status.*/
  update(
    workspaceId: string,
    environmentId: string,
    id: string,
    body: Schema.OAuthAppUpdateBodyDto,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.OAuthApp_Output> {
    return this.core.request({
      method: 'PUT',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/oauth-apps/${encodeURIComponent(id)}`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspaces/{workspaceId}/environments/{environmentId}/oauth-apps/{id}/revoke-all*
   * @summary Revoke all tokens for OAuth app*
   * @description Revokes all active tokens associated with an OAuth app. This is useful for security incidents or when rotating app credentials.*/
  revokeAllTokens(
    workspaceId: string,
    environmentId: string,
    id: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/oauth-apps/${encodeURIComponent(id)}/revoke-all`,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/workspaces/{workspaceId}/environments/{environmentId}/oauth-apps/{id}/rotate-secret*
   * @summary Rotate client secret*
   * @description Rotates the client secret for an OAuth app. Returns the new secret only once. Subsequent calls return a success message without the secret.*/
  rotateSecret(
    workspaceId: string,
    environmentId: string,
    id: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.OAuthAppRotateSecretResponse_Output> {
    return this.core.request({
      method: 'POST',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/oauth-apps/${encodeURIComponent(id)}/rotate-secret`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/workspaces/{workspaceId}/environments/{environmentId}/oauth-apps/{id}/tokens*
   * @summary List tokens for OAuth app*
   * @description Retrieves a list of tokens (refresh tokens) associated with an OAuth app. Supports filtering by token type and active status. Token values are never returned.*/
  listTokens(
    workspaceId: string,
    environmentId: string,
    id: string,
    query?: Schema.OauthAppsListTokensQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.OAuthAppTokenList_Output> {
    return this.core.request({
      method: 'GET',
      path: `/v1/workspaces/${encodeURIComponent(workspaceId)}/environments/${encodeURIComponent(environmentId)}/oauth-apps/${encodeURIComponent(id)}/tokens`,
      query,
      ...(init ?? {}),
    });
  }
}
