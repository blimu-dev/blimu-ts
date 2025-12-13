import { CoreClient } from '../client';
import * as Schema from '../schema';

export class AuthService {
  constructor(private core: CoreClient) {}

  /**
   * POST /v1/auth/logout
   * @summary Logout and invalidate session
   */
  logout(init?: Omit<RequestInit, 'method' | 'body'>): Promise<unknown> {
    return this.core.request({
      method: 'POST',
      path: `/v1/auth/logout`,
      ...(init || {}),
    });
  }

  /**
   * POST /v1/auth/refresh
   * @summary Refresh session token
   */
  refresh(init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.RefreshResponse> {
    return this.core.request({
      method: 'POST',
      path: `/v1/auth/refresh`,
      ...(init || {}),
    });
  }

  /**
   * GET /v1/auth/session
   * @summary Get current session
   */
  getSession(init?: Omit<RequestInit, 'method' | 'body'>): Promise<Schema.SessionResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/auth/session`,
      ...(init || {}),
    });
  }
}
