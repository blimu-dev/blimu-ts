import Cookies from 'js-cookie';

import type { AuthState } from '../types';
import { Blimu } from '@blimu/client';
import { ExternalStore } from './external-store';
import { BaseAuthSessionService } from './auth.service.base';

export const LOCALHOST_JWT_URL_PARAM_NAME = '__lh_jwt';
export const LOCALHOST_JWT_COOKIE_NAME = '__lh_jwt';

/**
 * Test/development authentication session service.
 * Handles non-secure cookies and supports localhost JWT handling for development.
 */
export class TestAuthSessionService extends BaseAuthSessionService {
  constructor(
    client: Blimu,
    store: ExternalStore<AuthState>,
    baseURL: string,
    publishableKey: string,
  ) {
    super(client, store, baseURL, publishableKey);
  }

  /**
   * Set cookie with secure flag disabled for localhost development.
   */
  protected setCookie(name: string, value: string, options: { maxAge?: number } = {}): void {
    const cookieOptions: Cookies.CookieAttributes = {
      secure: false, // Non-secure for localhost development
      sameSite: 'lax',
      path: '/',
    };

    if (options.maxAge !== undefined) {
      cookieOptions.expires = options.maxAge / (24 * 60 * 60); // Convert seconds to days
    }

    Cookies.set(name, value, cookieOptions);
  }

  /**
   * Get localhost JWT from cookie.
   * This method only exists in TestAuthSessionService - not in base class or live service.
   * Note: URL parameter handling is done in initialize() and stored in cookie.
   */
  private getLocalhostJWT(): string | undefined {
    return Cookies.get(LOCALHOST_JWT_COOKIE_NAME);
  }

  /**
   * Build refresh request parameters.
   * Test services include localhost JWT if available.
   */
  protected buildRefreshParams(): Record<string, string | undefined> {
    const localhostJWT = this.getLocalhostJWT();
    return { __lh_jwt: localhostJWT };
  }

  /**
   * Test services handle localhost JWT.
   */
  protected shouldHandleLocalhostJWT(): boolean {
    return true;
  }

  /**
   * Remove localhost JWT cookie on errors.
   */
  protected cleanupLocalhostJWT(): void {
    Cookies.remove(LOCALHOST_JWT_COOKIE_NAME);
  }
}
