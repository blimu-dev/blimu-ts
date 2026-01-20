import type { FetchClient } from '@blimu/fetch';
import type * as Schema from '../schema';
import { isNotUndefined } from '../utils';

export class AuthService {
  constructor(private core: FetchClient) {}

  /**
   * POST /v1/auth/logout*
   * @summary Logout and invalidate session*/
  logout(init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown> {
    return this.core.request({
      method: 'POST',
      path: `/v1/auth/logout`,
      ...(init ?? {}),
    });
  }
  /**
   * @summary Get query keys for logout
   * @returns ['v1/auth/logout']
   */
  logout__queryKeys(): readonly ['v1/auth/logout'] {
    return ['v1/auth/logout'] as const;
  }

  /**
   * POST /v1/auth/refresh*
   * @summary Refresh session token*/
  refresh(
    query?: Schema.AuthRefreshQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.RefreshResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/auth/refresh`,
      query,
      ...(init ?? {}),
    });
  }
  /**
   * @summary Get query keys for refresh
   * @returns ['v1/auth/refresh', query]
   */
  refresh__queryKeys(query?: Schema.AuthRefreshQuery): readonly string[] {
    const keys = ['v1/auth/refresh', query] as const;
    return isNotUndefined(keys) as readonly string[];
  }

  /**
   * GET /v1/auth/session*
   * @summary Get current session*/
  getSession(init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.SessionResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/auth/session`,
      ...(init ?? {}),
    });
  }
  /**
   * @summary Get query keys for getSession
   * @returns ['v1/auth/session']
   */
  getSession__queryKeys(): readonly ['v1/auth/session'] {
    return ['v1/auth/session'] as const;
  }
}
