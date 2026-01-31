import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';

export class AuthJwksService {
  constructor(private core: FetchClient) {}

  /**
   * GET /v1/auth/.well-known/jwks.json*
   * @summary Get JSON Web Key Set for environment (Public)*
   * @description Returns the public keys used to verify JWT tokens issued by this environment. Authenticate using either x-api-key header (secretKey) or x-blimu-publishable-key header (publishableKey).*/
  getJwks(init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.JWK> {
    return this.core.request({
      method: 'GET',
      path: `/v1/auth/.well-known/jwks.json`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/auth/.well-known/public-key.pem*
   * @summary Get environment public key (PEM)*
   * @description Returns the public key in PEM format for verifying JWT tokens. Authenticate with x-api-key or x-blimu-publishable-key.*/
  getPublicKeyPem(init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown> {
    return this.core.request({
      method: 'GET',
      path: `/v1/auth/.well-known/public-key.pem`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/auth/oauth/.well-known/jwks.json*
   * @summary Get JSON Web Key Set for OAuth app (Public)*
   * @description Returns the public key for a specific OAuth app to verify JWT tokens. This is a public endpoint following OAuth2/OIDC standards. Provide client_id to get keys for a specific OAuth app, or use authenticated endpoint for environment keys.*/
  getOAuthAppJwks(
    query?: Schema.AuthJwksGetOAuthAppJwksQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.JWK> {
    return this.core.request({
      method: 'GET',
      path: `/v1/auth/oauth/.well-known/jwks.json`,
      query,
      ...(init ?? {}),
    });
  }
}
