import { Blimu, BlimuError } from '@blimu/client';
import type { RefreshResponse } from '@blimu/client/schema';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

import type { AuthState, User } from '../types';
import { ExternalStore } from './external-store';

export const SESSION_COOKIE_NAME = '__bli_session';
export const SESSION_URL_PARAM_NAME = '__session';
export const SESSION_EXPIRATION_BUFFER = 10;

/**
 * Time conversion utilities
 * JWT tokens use seconds (Unix timestamp), JavaScript Date uses milliseconds
 */
const SECONDS_TO_MS = 1000;

/**
 * Convert seconds to milliseconds
 */
const secondsToMilliseconds = (seconds: number): number => Math.floor(seconds * SECONDS_TO_MS);

/**
 * Convert milliseconds to seconds
 */
const millisecondsToSeconds = (ms: number): number => Math.floor(ms / SECONDS_TO_MS);

/**
 * Get current time in seconds (Unix timestamp)
 */
const nowInSeconds = (): number => millisecondsToSeconds(Date.now());

/**
 * Convert JWT expiration time (seconds) to milliseconds
 */
const jwtExpToMilliseconds = (exp: number): number => secondsToMilliseconds(exp);

/**
 * Calculate timeout delay in milliseconds for refreshing before expiration
 * @param expirationSeconds - JWT exp claim in seconds
 * @param bufferSeconds - Buffer time in seconds before expiration
 * @returns Timeout delay in milliseconds
 */
const calculateTimeoutDelay = (expirationSeconds: number, bufferSeconds: number): number => {
  const expirationMS = jwtExpToMilliseconds(expirationSeconds);
  const bufferMS = secondsToMilliseconds(bufferSeconds);
  const nowMS = Date.now();
  return Math.max(expirationMS - bufferMS - nowMS, 0);
};

/**
 * Check if a JWT expiration time (in seconds) is expired or will expire within the buffer
 * @param expiration - JWT exp claim in seconds (Unix timestamp)
 * @param buffer - Buffer time in seconds before expiration to consider it expired
 * @returns true if expired or will expire within buffer
 */
export const isExpiredIn = (expiration: number, buffer: number): boolean => {
  const now = nowInSeconds();
  return expiration - buffer < now;
};

export class AuthSessionService {
  private pendingRefresher: (() => void) | null = null;
  private refreshPromise: Promise<RefreshResponse | { error: string; user: null }> | null = null;
  private refreshingSignals: Set<AbortSignal> = new Set();
  private refreshingSignalAbortController: AbortController | null = null;
  // A local client that doesn't call getSessionToken() which calls refreshSession().
  private localClient: Blimu;

  constructor(
    private readonly client: Blimu,
    private readonly store: ExternalStore<AuthState>,
    baseURL: string,
    publishableKey: string,
  ) {
    this.localClient = new Blimu({
      baseURL,
      credentials: 'include',
      headers: { 'x-blimu-publishable-key': publishableKey },
    });
    this.handleRequestError = this.handleRequestError.bind(this);
  }

  // initialize(sessionJWT: string): void {}

  getSessionPayload(): {
    sub: string;
    environmentId: string;
    type: string;
    iat: number;
    exp: number;
  } | null {
    const token = Cookies.get(SESSION_COOKIE_NAME);

    if (!token) {
      return null;
    }

    const decoded = jwtDecode<{
      sub: string;
      environmentId: string;
      type: string;
      iat: number;
      exp: number;
    }>(token);

    return decoded;
  }

  async getSessionToken(): Promise<string | undefined> {
    const sessionPayload = this.getSessionPayload();

    if (!sessionPayload) {
      return undefined;
    }

    // If a refresh is already in progress, wait for it to complete
    // This prevents infinite recursion when refreshSession() calls client.auth.refresh()
    // which triggers accessToken() which calls getSessionToken()
    if (this.refreshPromise) {
      await this.refreshPromise;
      // After refresh completes, return the updated token from cookie
      return Cookies.get(SESSION_COOKIE_NAME);
    }

    if (isExpiredIn(sessionPayload.exp, 0)) {
      await this.refreshSession();
    }

    return Cookies.get(SESSION_COOKIE_NAME);
  }

  async handleRequestError(error: unknown): Promise<{ error: string; user: null }> {
    if (error instanceof BlimuError && [401, 500].includes(error.status)) {
      Cookies.remove(SESSION_COOKIE_NAME);
      return {
        error: error.message,
        user: null,
      };
    }

    if (error instanceof DOMException)
      return {
        error: error.message,
        user: null,
      };

    if (error instanceof Error) {
      return {
        error: error.message,
        user: null,
      };
    }

    return {
      error: 'unknown error',
      user: null,
    };
  }

  async initialize({
    sessionJWT,
    signal,
  }: { sessionJWT?: string; signal?: AbortSignal } = {}): Promise<{
    error: string | null;
    user: User | null;
  }> {
    if (sessionJWT) {
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);
    }

    const sessionPayload = this.getSessionPayload();

    if (!sessionPayload) {
      return {
        error: null,
        user: null,
      };
    }

    if (isExpiredIn(sessionPayload.exp, SESSION_EXPIRATION_BUFFER)) {
      const result = await this.refreshSession({ signal }).catch(this.handleRequestError);
      if ('error' in result) return result;
    }

    const result = await this.client.auth.getSession({ signal }).catch(this.handleRequestError);
    if ('error' in result) return result;

    return {
      error: null,
      user: result.user,
    };
  }

  scheduleRefresh() {
    const abortController = new AbortController();
    let isOnline = true;
    let timeoutId: number | null = null;

    const onlineHandler = () => {
      isOnline = true;
      if (this.pendingRefresher) {
        this.pendingRefresher();
        this.pendingRefresher = null;
      }
    };
    const offlineHandler = () => {
      isOnline = false;
    };

    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    const refresh = () => {
      // Clear any existing timeout before scheduling a new one
      // This prevents infinite loops when refresh() is called recursively
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }

      const sessionPayload = this.getSessionPayload();

      if (!sessionPayload || isExpiredIn(sessionPayload.exp, 0)) return;

      // Calculate timeout delay: refresh SESSION_EXPIRATION_BUFFER seconds before expiration
      const timeoutDelayMS = calculateTimeoutDelay(sessionPayload.exp, SESSION_EXPIRATION_BUFFER);

      // Prevent scheduling if timeout is too short (less than 1 second)
      // This prevents immediate re-scheduling that could cause infinite loops
      if (timeoutDelayMS < 1000) {
        return;
      }

      // Having this function outside timeout, allows us to call refresh immediately when back online
      const refresher = async () => {
        // Clear timeoutId since we're executing now
        timeoutId = null;

        if (!isOnline) {
          // Keep closure of refresh function alive
          this.pendingRefresher = refresher;
          return;
        }

        const result = await this.refreshSession({ signal: abortController.signal });

        if ('error' in result) {
          // If the refresh was aborted (e.g., due to React strict mode unmounting),
          // don't treat it as an error - just return and let the component remount handle it
          if (result.error === 'aborted') {
            return;
          }
          // For real errors, update the store
          this.store.setState({
            status: 'error',
            user: null,
            error: result.error,
          });
          return;
        } else {
          // After successful refresh, schedule the next refresh with the new token
          refresh();
        }
      };

      timeoutId = window.setTimeout(refresher, timeoutDelayMS);
    };

    refresh();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      abortController.abort();
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }

  private async refreshSession({ signal }: { signal?: AbortSignal } = {}) {
    if (signal) {
      // Add signal to tracking set (was using .has() instead of .add() - bug fix)
      this.refreshingSignals.add(signal);

      signal.addEventListener('abort', () => {
        this.refreshingSignals.delete(signal);

        if (this.refreshingSignals.size === 0) {
          this.refreshingSignalAbortController?.abort();
        }
      });
    }

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshingSignalAbortController = new AbortController();

    this.refreshingSignalAbortController.signal.addEventListener('abort', () => {
      this.refreshPromise = null;
      this.refreshingSignalAbortController = null;
      this.refreshingSignals.clear();
    });

    // Use local client to avoid infinite recursion. Regular client calls getSessionToken() which calls refreshSession().
    // There are hacks to avoid infinite recursion, but they are not reliable.
    this.refreshPromise = this.localClient.auth
      .refresh({ signal: this.refreshingSignalAbortController.signal })
      .then((response) => {
        // Update cookie with new session token from response
        // Server also sets it via Set-Cookie header, but we set it manually to ensure it works
        if (response.sessionToken) {
          Cookies.set(SESSION_COOKIE_NAME, response.sessionToken);
        }
        return response;
      })
      .catch(this.handleRequestError);

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
      this.refreshingSignalAbortController = null;
      this.refreshingSignals.clear();
    }
  }
}
