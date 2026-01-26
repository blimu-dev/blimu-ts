import { Blimu } from '@blimu/client';

import type { AuthState, BlimuConfig } from '../types';
import { getAuthApiUrl, getAuthDomainFromPublishableKey } from '../utils/publishable-key';
import { AuthSessionService } from './auth.service';
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
   */
  public logout = async (): Promise<void> => {
    try {
      const sessionToken = await this.session.getSessionToken();

      if (sessionToken) {
        await this.client.auth.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.store.setState({
        user: null,
        error: null,
        status: 'unauthenticated',
      });
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
