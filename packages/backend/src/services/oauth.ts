import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';

export class OauthService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/oauth/authorize*
   * @summary Check consent requirement*
   * @description Checks if user consent is required for the OAuth2 app and requested scopes.*/
  checkConsentRequired(
    query?: Schema.OauthCheckConsentRequiredQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.ConsentCheckResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/oauth/authorize`,
      query,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/oauth/authorize*
   * @summary Authorize OAuth2 application*
   * @description Handles user consent approval/denial. Validates auto_approved flag against consent requirements.*/
  authorize(
    body: Schema.AuthorizeRequest,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'POST',
      path: `/v1/oauth/authorize`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/oauth/device/authorize*
   * @summary Authorize or deny device code*
   * @description Allows an authenticated user to authorize or deny a device code request. Requires valid user session.*/
  authorizeDeviceCode(
    body: Schema.DeviceAuthorizeRequest,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.DeviceAuthorizeResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/oauth/device/authorize`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/oauth/device/code*
   * @summary Request device authorization codes*
   * @description Initiates device authorization flow. Returns device_code (for polling) and user_code (for user entry).*/
  requestDeviceCode(
    body: Schema.DeviceCodeRequest,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.DeviceCodeResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/oauth/device/code`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/oauth/device/code/{user_code}*
   * @summary Get device code information*
   * @description Returns device code information including app name, scopes, and consent requirement status.*/
  getDeviceCodeInfo(
    user_code: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.DeviceCodeInfoResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/oauth/device/code/${encodeURIComponent(user_code)}`,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/oauth/device/token*
   * @summary Poll for device authorization tokens*
   * @description Client polls this endpoint to exchange device_code for tokens once user has authorized.*/
  exchangeDeviceCode(
    body: Schema.DeviceTokenRequest,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.TokenResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/oauth/device/token`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/oauth/introspect*
   * @summary Introspect token*
   * @description Validates a token and returns metadata. Requires client authentication.*/
  introspect(
    body: Schema.IntrospectionRequest,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.IntrospectionResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/oauth/introspect`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/oauth/revoke*
   * @summary Revoke token*
   * @description Revokes an access or refresh token. Requires client authentication.*/
  revoke(
    body: Schema.RevocationRequest,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'POST',
      path: `/v1/oauth/revoke`,
      body,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/oauth/token*
   * @summary Token endpoint*
   * @description Issues access and refresh tokens. Supports authorization_code and refresh_token (always available per OAuth2 spec).*/
  token(
    body: Schema.TokenRequest,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.TokenResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/oauth/token`,
      body,
      ...(init ?? {}),
    });
  }
}
