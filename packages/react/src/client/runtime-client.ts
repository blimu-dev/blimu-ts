import { Blimu } from '@blimu/client';
import Cookies from 'js-cookie';

import type { AuthState, BlimuConfig } from '../types';
import { getAuthApiUrl, getAuthDomainFromPublishableKey } from '../utils/publishable-key';
import { AuthSessionService, LOCALHOST_JWT_COOKIE_NAME, SESSION_COOKIE_NAME } from './auth.service';
import { ExternalStore } from './external-store';

export class BlimuRuntimeClientWrapper {
  private client: Blimu;
  private authDomain: string | null = null;
  private initialized = false;
  private readonly session: AuthSessionService;

  public config: BlimuConfig;
  public isLive: boolean;
  private initializePromise: Promise<void> | null = null;
  private initializeAbortController: AbortController | null = null;

  public readonly store: ExternalStore<AuthState>;

  constructor(config: BlimuConfig) {
    this.config = config;
    this.store = new ExternalStore<AuthState>({
      user: null,
      error: null,
      status: 'idle',
    });
    this.isLive = config.publishableKey.includes('live');

    // Get auth UI domain from publishable key
    this.authDomain = getAuthDomainFromPublishableKey(config.publishableKey);
    if (!this.authDomain) {
      throw new Error('Failed to determine auth domain from publishable key');
    }

    // Get auth API URL from publishable key
    const authApiUrl = getAuthApiUrl(config.publishableKey);

    if (!authApiUrl) {
      throw new Error('Failed to determine auth API URL from publishable key');
    }

    this.client = new Blimu({
      baseURL: authApiUrl,
      bearer: () => this.session.getSessionToken(),
      headers: { 'x-blimu-publishable-key': config.publishableKey },
      credentials: 'include', // Required to send httpOnly cookies (like __bli_client) in cross-origin requests
    });

    this.session = new AuthSessionService(
      this.isLive,
      this.client,
      this.store,
      authApiUrl,
      config.publishableKey,
    );

    this.initialize = this.initialize.bind(this);
  }

  /**
   * Initialize authentication by checking for existing session
   * Reads session token from cookie and validates it
   * This method is idempotent - if initialization is already in progress, it will wait for that to complete
   */
  initialize(): (() => void) | void {
    // If already initialized, return early
    if (this.initialized) return;

    // If initialization is in progress, return early (prevents concurrent calls)
    if (this.initializePromise) return;

    this.initializeAbortController = new AbortController();

    this.initializePromise = this.session
      .initialize({
        signal: this.initializeAbortController.signal,
      })
      .then((result) => {
        if (result.error) {
          this.store.setState({
            user: null,
            error: result.error,
            status: 'error',
          });
        } else if (result.user) {
          this.store.setState({
            user: result.user,
            error: null,
            status: 'authenticated',
          });
        } else {
          this.store.setState({
            user: null,
            error: null,
            status: 'unauthenticated',
          });
        }
      })
      .catch((error) => {
        console.error('Initialize error:', error);
        this.store.setState({
          user: null,
          error: error instanceof Error ? error.message : 'Initialization failed',
          status: 'error',
        });
      })
      .finally(() => {
        // Mark as initialized after completion (success or failure)
        // This prevents infinite loops from re-renders
        this.initialized = true;
        this.initializePromise = null;
      });

    return () => {
      console.log('aborting initialize');
      this.initializeAbortController?.abort('unmounting');
      this.initializePromise = null;
      // Don't reset initialized flag here - let the promise handle it
    };
  }

  /**
   * Refresh session token using the client token from httpOnly cookie
   * The client token is stored in an httpOnly cookie and sent automatically
   * Note: The auth worker should extract the __bli_client cookie and include it in the request body
   * This method is idempotent - if a refresh is already in progress, it will wait for that refresh to complete
   */
  public scheduleRefresh(): void {
    this.session.scheduleRefresh();
  }

  /**
   * Redirect user to auth domain for authentication
   * Uses the auth domain derived from the publishable key
   */
  public redirectToAuth = (returnUrl?: string): void => {
    const redirectUrl = returnUrl ?? window.location.href;

    // Build auth URL on the auth domain
    const authUrl = new URL(`${this.authDomain}/login`);
    authUrl.searchParams.set('redirect_url', encodeURIComponent(redirectUrl));

    // Redirect to auth domain
    window.location.href = authUrl.toString();
  };

  /**
   * Logout user
   * Calls the logout endpoint on the API domain using this.client
   * For TEST environments: sends __lh_jwt query parameter from cookie
   * For LIVE environments: uses __bli_client cookie automatically
   */
  public logout = async (): Promise<void> => {
    console.log('[logout] Starting logout...');
    console.log('[logout] Cookies before logout:', document.cookie);
    try {
      const sessionToken = await this.session.getSessionToken();

      if (sessionToken) {
        // For TEST environments: Get localhostJwt from cookie and pass as query parameter
        const localhostJWT = this.isLive ? undefined : Cookies.get(LOCALHOST_JWT_COOKIE_NAME);

        console.log('[logout] Calling logout API...');
        await this.client.auth.logout({
          // Build query parameters - only include __lh_jwt for non-live environments when cookie exists
          ...(localhostJWT ? { __lh_jwt: localhostJWT } : {}),
        });
        console.log('[logout] Logout API call successful');

        // Clear localhostJwt cookie for TEST environments after logout
        if (!this.isLive && localhostJWT) {
          Cookies.remove(LOCALHOST_JWT_COOKIE_NAME, { path: '/' });
        }
      }
    } catch (error) {
      console.error('[logout] Logout error:', error);
    } finally {
      // Clear session cookie manually (server Set-Cookie may not work cross-origin)
      // For LIVE environments, cookie has domain attribute (e.g., .dev-blimu.dev)
      // Extract base domain from auth domain (e.g., id.dev-blimu.dev -> .dev-blimu.dev)
      console.log('[logout] Clearing session cookie...');
      if (this.isLive && this.authDomain) {
        const baseDomain = this.authDomain.replace(/^https?:\/\//, '').replace(/^id\./, '');
        console.log('[logout] Removing cookie with domain:', `.${baseDomain}`);
        Cookies.remove(SESSION_COOKIE_NAME, { path: '/', domain: `.${baseDomain}` });
      } else {
        Cookies.remove(SESSION_COOKIE_NAME, { path: '/' });
      }
      console.log('[logout] Cookies after clearing:', document.cookie);

      this.store.setState({
        user: null,
        error: null,
        status: 'unauthenticated',
      });
      console.log('[logout] Logout complete, state set to unauthenticated');
    }
  };

  /**
   * Get the current session token
   */

  getAccessToken = async (_options: { template: 'web' }): Promise<string | undefined> => {
    return await this.session.getSessionToken();
  };

  /**
   * Get the runtime client for direct API calls
   */
  getClient(): Blimu {
    return this.client;
  }
}
