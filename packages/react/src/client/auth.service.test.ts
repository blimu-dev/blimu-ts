import { Blimu, BlimuError } from '@blimu/client';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthSessionService, LOCALHOST_JWT_COOKIE_NAME, SESSION_COOKIE_NAME } from './auth.service';

const ONE_MINUTE = 60;
const NINE_SECONDS = 9;
const THIRTY_DAYS = 30 * 24 * 60 * 60;

// Fixed timestamp for consistent tests (2024-01-01 00:00:00 UTC)
const FIXED_TIMESTAMP = 1704067200000;

const PUBLISHABLE_KEY = 'pk_test_YmxhY2tiaXJkJGVudl9PZm5vRXIxMWZnNVdDa3hpM2U4VjA';

import fetchPolyfill, { Request as RequestPolyfill } from 'node-fetch';

import type { AuthState } from '../types';
import { ExternalStore } from './external-store';
import { AuthRefreshQuery } from '@blimu/client/schema';

Object.defineProperty(global, 'fetch', {
  // MSW will overwrite this to intercept requests
  writable: true,
  value: fetchPolyfill,
});

Object.defineProperty(global, 'Request', {
  writable: false,
  value: RequestPolyfill,
});

const server = setupServer(
  // capture "GET /greeting" requests
  http.post('http://localhost:3020/v1/auth/refresh', () => {
    const now = Math.floor(Date.now() / 1000);
    const sessionJWT = jwt.sign(
      {
        sub: 'test_user_id',
        environmentId: 'test_environment_id',
        type: 'session',
        iat: now,
        exp: now + ONE_MINUTE,
        se: now + THIRTY_DAYS,
      },
      'test_secret',
    );

    return HttpResponse.json(
      {
        sessionToken: sessionJWT,
      },
      {
        headers: new Headers({
          'Set-Cookie': `__bli_session=${sessionJWT}`,
        }),
      },
    );
  }),

  http.get('http://localhost:3020/v1/auth/session', () => {
    return HttpResponse.json({
      user: {
        id: 'test_user_id',
      },
    });
  }),
);

describe('AuthService', () => {
  let client: Blimu;
  let authService: AuthSessionService;

  let ONE_MINUTE_PAYLOAD: {
    sub: string;
    environmentId: string;
    type: string;
    iat: number;
    exp: number;
    se: number;
  };

  let ABOUT_TO_EXPIRE_PAYLOAD: {
    sub: string;
    environmentId: string;
    type: string;
    iat: number;
    exp: number;
    se: number;
  };

  let EXPIRED_PAYLOAD: {
    sub: string;
    environmentId: string;
    type: string;
    iat: number;
    exp: number;
    se: number;
  };

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    // Mock Date.now() to return a fixed timestamp
    vi.spyOn(Date, 'now').mockReturnValue(FIXED_TIMESTAMP);

    ONE_MINUTE_PAYLOAD = {
      sub: 'test_user_id',
      environmentId: 'test_environment_id',
      type: 'session',
      iat: Math.floor(FIXED_TIMESTAMP / 1000),
      exp: Math.floor(FIXED_TIMESTAMP / 1000) + ONE_MINUTE,
      se: Math.floor(FIXED_TIMESTAMP / 1000) + THIRTY_DAYS,
    };

    ABOUT_TO_EXPIRE_PAYLOAD = {
      ...ONE_MINUTE_PAYLOAD,
      exp: Math.floor(FIXED_TIMESTAMP / 1000) + NINE_SECONDS,
    };

    EXPIRED_PAYLOAD = {
      ...ONE_MINUTE_PAYLOAD,
      exp: Math.floor(FIXED_TIMESTAMP / 1000) - 1,
    };

    client = new Blimu({
      baseURL: 'http://localhost:3020',
      accessToken: () => 'test_access_token',
      headers: {
        'x-blimu-publishable-key': PUBLISHABLE_KEY,
      },
    });
    const store = new ExternalStore<AuthState>({
      user: null,
      error: null,
      status: 'idle',
    });
    authService = new AuthSessionService(
      true,
      client,
      store,
      'http://localhost:3020',
      PUBLISHABLE_KEY,
    );
    Cookies.remove(SESSION_COOKIE_NAME);
    Cookies.remove(LOCALHOST_JWT_COOKIE_NAME);
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
    // Restore Date.now() to its original implementation
    vi.restoreAllMocks();
  });

  describe('getSessionPayload', () => {
    it('should return null if the cookie is not set', async () => {
      const sessionToken = await authService.getSessionPayload();
      expect(sessionToken).toBeNull();
    });

    it('should return the session token from the cookie', async () => {
      const sessionJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');

      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);

      const sessionTokenPayload = await authService.getSessionPayload();
      expect(sessionTokenPayload).toEqual(ONE_MINUTE_PAYLOAD);
    });
  });

  describe('initialize', () => {
    it('should set initial session token when provided', async () => {
      const localhostJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');

      // Mock window.location.href with the JWT in the query string
      Object.defineProperty(window, 'location', {
        value: {
          href: `http://localhost:3000?__lh_jwt=${localhostJWT}`,
        },
        writable: true,
        configurable: true,
      });

      // Mock window.history.replaceState to avoid errors
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});

      await authService.initialize();

      expect(Cookies.get(LOCALHOST_JWT_COOKIE_NAME)).toBe(localhostJWT);
      expect(replaceStateSpy).toHaveBeenCalled();

      // Restore window.location to a clean URL
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000',
        },
        writable: true,
        configurable: true,
      });

      replaceStateSpy.mockRestore();
    });

    it('should return null if the session token is not set', async () => {
      // Ensure no cookies are set
      Cookies.remove(SESSION_COOKIE_NAME);
      Cookies.remove(LOCALHOST_JWT_COOKIE_NAME);

      const result = await authService.initialize();
      expect(result.error).toBeNull();
      expect(result.user).toBeNull();
    });

    it('should refresh session token if expired or about to expire', async () => {
      const now = Math.floor(Date.now() / 1000);
      const sessionJWT = jwt.sign(ABOUT_TO_EXPIRE_PAYLOAD, 'test_secret');

      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);

      await authService.initialize();

      expect(Cookies.get(SESSION_COOKIE_NAME)).not.toBe(sessionJWT);

      const sessionPayload = await authService.getSessionPayload();

      expect(sessionPayload?.exp).toBe(now + ONE_MINUTE);
    });

    it('should clear session token if refresh response is 401', async () => {
      const sessionJWT = jwt.sign(ABOUT_TO_EXPIRE_PAYLOAD, 'test_secret');
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);

      server.use(
        http.post('http://localhost:3020/v1/auth/refresh', () =>
          HttpResponse.json(null, {
            status: 401,
          }),
        ),
      );

      await authService.initialize();

      expect(Cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
    });

    it('should clear session token and return null if refresh response is 500', async () => {
      const sessionJWT = jwt.sign(ABOUT_TO_EXPIRE_PAYLOAD, 'test_secret');
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);

      server.use(
        http.post('http://localhost:3020/v1/auth/refresh', () =>
          HttpResponse.json(null, {
            status: 500,
          }),
        ),
      );

      const result = await authService.initialize();

      expect(Cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
      expect(result.error).toBe('HTTP 500');
      expect(result.user).toBeNull();
    });

    it('should return null if session response is 401', async () => {
      const sessionJWT = jwt.sign(ABOUT_TO_EXPIRE_PAYLOAD, 'test_secret');
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);

      server.use(
        http.get('http://localhost:3020/v1/auth/session', () =>
          HttpResponse.json(null, {
            status: 401,
            statusText: 'Unauthorized',
          }),
        ),
      );

      const result = await authService.initialize();

      expect(Cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
      expect(result.error).toBe('HTTP 401');
      expect(result.user).toBeNull();
    });

    it('should return user if authenticated', async () => {
      const sessionJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');

      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);

      const result = await authService.initialize();

      expect(result.user).toEqual({ id: 'test_user_id' });
    });
  });

  describe('scheduleRefresh', () => {
    // we should use useEffect to schedule the refresh
    it('should not schedule a refresh if the session token is expired', () => {
      const sessionJWT = jwt.sign(EXPIRED_PAYLOAD, 'test_secret');
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);
      vi.useFakeTimers();
      vi.spyOn(window, 'setTimeout');

      vi.spyOn(authService, 'getSessionPayload').mockReturnValue(EXPIRED_PAYLOAD);

      authService.scheduleRefresh();
      vi.advanceTimersByTime(50000);

      expect(window.setTimeout).not.toHaveBeenCalled();
    });

    it('should set timeout to refresh the session token on t-10', async () => {
      const sessionJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);

      vi.useFakeTimers();

      // Mock the refresh to succeed first time, fail second time
      const refreshSpy = vi
        .spyOn(authService['localClient'].auth, 'refresh')
        .mockResolvedValueOnce({
          sessionToken: jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret'),
        })
        .mockImplementationOnce(() =>
          Promise.reject(new BlimuError('Refresh failed', 401, 'Refresh failed')),
        );

      vi.spyOn(authService, 'scheduleRefresh');
      vi.spyOn(window, 'setTimeout');

      authService.scheduleRefresh();

      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 50000);

      // Advance timers to trigger first timeout and wait for async operations
      await vi.advanceTimersByTimeAsync(50000);

      // First refresh should have been called
      expect(refreshSpy).toHaveBeenCalledTimes(1);

      // Wait for the refresh to complete and the recursive refresh() call to set up the next timeout
      await vi.waitFor(() => {
        expect(window.setTimeout).toHaveBeenCalledTimes(2);
      });

      // Advance timers to trigger second timeout
      await vi.advanceTimersByTimeAsync(50000);

      // Second refresh should have been called
      expect(refreshSpy).toHaveBeenCalledTimes(2);

      // Wait for the failed refresh to complete and handle the error
      await vi.runAllTimersAsync();

      // Extra guardrail to make sure the loop stops when the refresh fails.
      // After the 401 error, the session should be cleared and no more timeouts should be scheduled
      expect(Cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
      // The third setTimeout should not be called because session is cleared
      expect(window.setTimeout).toHaveBeenCalledTimes(2);
    });

    it('should return a function to unsubscribe from the refresh', () => {
      const sessionJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);
      vi.useFakeTimers();

      const mockTimeoutId = 10;
      vi.spyOn(AbortController.prototype, 'abort');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      vi.spyOn(window, 'setTimeout').mockImplementation((_callback: () => void) => {
        // Don't call callback immediately - just return the mock ID
        return mockTimeoutId as unknown as NodeJS.Timeout;
      });

      vi.spyOn(window, 'clearTimeout');

      const unsubscribe = authService.scheduleRefresh();
      expect(unsubscribe).toBeInstanceOf(Function);

      unsubscribe?.();

      expect(window.clearTimeout).toHaveBeenCalledWith(mockTimeoutId);
      expect(AbortController.prototype.abort).toHaveBeenCalled();
    });

    it('should abort request even if timeout is already called', async () => {
      const sessionJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);
      vi.useFakeTimers();

      let requestAborted = false;

      server.use(
        http.post('http://localhost:3020/v1/auth/refresh', async ({ request }) => {
          // Listen for abort on the request signal
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
            setTimeout(() => {
              if (request.signal.aborted) {
                requestAborted = true;
              }
            }, 0);
          });

          return HttpResponse.json({
            sessionToken: jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret'),
          });
        }),
      );

      const refreshSpy = vi.spyOn(authService['localClient'].auth, 'refresh');

      const unsubscribe = authService.scheduleRefresh();
      vi.advanceTimersByTime(50000);

      await vi.waitFor(() => expect(refreshSpy).toHaveBeenCalled());

      unsubscribe?.();

      await vi.waitFor(() => expect(requestAborted).toBe(true));
      // Tokens should not be cleared if the request is aborted
      expect(Cookies.get(SESSION_COOKIE_NAME)).toBe(sessionJWT);
    });

    it('should enqueue a refresh if the user is offline', async () => {
      const sessionJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);

      const refreshSpy = vi.spyOn(authService['localClient'].auth, 'refresh');
      vi.useFakeTimers();
      vi.spyOn(window, 'setTimeout');

      authService.scheduleRefresh();

      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 50000);

      window.dispatchEvent(new Event('offline'));

      vi.advanceTimersByTime(50000);

      expect(refreshSpy).not.toHaveBeenCalled();
      expect(authService['pendingRefresher']).toBeInstanceOf(Function);
      expect(Cookies.get(SESSION_COOKIE_NAME)).toBe(sessionJWT);
    });

    it('should flush pending refresh if user is back online', async () => {
      const sessionJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');
      Cookies.set(SESSION_COOKIE_NAME, sessionJWT);

      vi.useFakeTimers();

      // Mock refresh to succeed when coming back online, then fail with 401 to stop the loop
      const refreshSpy = vi
        .spyOn(authService['localClient'].auth, 'refresh')
        .mockResolvedValueOnce({
          sessionToken: jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret'),
        })
        .mockImplementationOnce(() =>
          Promise.reject(new BlimuError('Refresh failed', 401, 'Refresh failed')),
        );

      vi.spyOn(window, 'setTimeout');

      authService.scheduleRefresh();

      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 50000);

      // Advance timers to trigger the timeout
      await vi.advanceTimersByTimeAsync(50000);

      // We request a refresh. It succeeds. Then we call refresh again, which sets a second timeout.
      expect(refreshSpy).toHaveBeenCalledTimes(1);
      expect(window.setTimeout).toHaveBeenCalledTimes(2);

      // Simulate going offline
      window.dispatchEvent(new Event('offline'));

      // Now that we are offline, timeout should be triggered again.
      await vi.advanceTimersByTimeAsync(50000);

      // This time, refresh should not be called.
      expect(refreshSpy).not.toHaveBeenCalledTimes(2);
      expect(authService['pendingRefresher']).toBeInstanceOf(Function);

      // Simulate coming back online - this should call pendingRefresh()
      window.dispatchEvent(new Event('online'));

      // Verify pendingRefresh was cleared and refresh was called again
      expect(authService['pendingRefresher']).toBeNull();
      await vi.waitFor(() => expect(refreshSpy).toHaveBeenCalledTimes(2));

      // Wait for error handling to complete (the 401 error should clear the cookie)
      await vi.waitFor(() => {
        const cookie = Cookies.get(SESSION_COOKIE_NAME);
        return cookie === undefined;
      });

      // Debug: Check how many timers are pending
      console.log('Pending timers after coming back online:', vi.getTimerCount());

      // The second refresh (401) should have cleared the session and not scheduled a new timeout
      // So there should be no more pending timers
      expect(vi.getTimerCount()).toBe(0);

      // Cookie should be cleared because of 401
      expect(Cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
    });
  });

  describe('handleRequestError', () => {
    it('should handle BlimuError with status 401 and clear session cookie', async () => {
      const error = new BlimuError('Unauthorized', 401, 'Unauthorized');
      Cookies.set(SESSION_COOKIE_NAME, 'test_token');

      const result = await authService['handleRequestError'](error);

      expect(result).toEqual({
        error: 'Unauthorized',
        user: null,
      });
      expect(Cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
    });

    it('should handle BlimuError with status 500 and clear session cookie', async () => {
      const error = new BlimuError('Internal Server Error', 500, 'Internal Server Error');
      Cookies.set(SESSION_COOKIE_NAME, 'test_token');

      const result = await authService['handleRequestError'](error);

      expect(result).toEqual({
        error: 'Internal Server Error',
        user: null,
      });
      expect(Cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
    });

    it('should handle BlimuError with other status codes without clearing cookie', async () => {
      const error = new BlimuError('Not Found', 404, 'Not Found');
      Cookies.set(SESSION_COOKIE_NAME, 'test_token');

      const result = await authService['handleRequestError'](error);

      expect(result).toEqual({
        error: 'Not Found',
        user: null,
      });
      expect(Cookies.get(SESSION_COOKIE_NAME)).toBe('test_token');
    });

    it('should handle DOMException errors', async () => {
      const error = new DOMException('AbortError', 'AbortError');

      const result = await authService['handleRequestError'](error);

      expect(result).toEqual({
        error: 'AbortError',
        user: null,
      });
    });

    it('should handle generic Error instances', async () => {
      const error = new Error('Network error');

      const result = await authService['handleRequestError'](error);

      expect(result).toEqual({
        error: 'Network error',
        user: null,
      });
    });

    it('should handle unknown error types with fallback message', async () => {
      const result1 = await authService['handleRequestError']('string error');
      expect(result1).toEqual({
        error: 'unknown error',
        user: null,
      });

      const result2 = await authService['handleRequestError'](null);
      expect(result2).toEqual({
        error: 'unknown error',
        user: null,
      });

      const result3 = await authService['handleRequestError']({});
      expect(result3).toEqual({
        error: 'unknown error',
        user: null,
      });
    });
  });

  describe('refreshSession', () => {
    it('should successfully refresh session token without signal (live mode - no __lh_jwt)', async () => {
      const mockRefreshResponse = {
        sessionToken: jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret'),
      };

      // Ensure no localhost JWT cookie is set
      Cookies.remove(LOCALHOST_JWT_COOKIE_NAME);

      const refreshSpy = vi
        .spyOn(authService['localClient'].auth, 'refresh')
        .mockResolvedValue(mockRefreshResponse);

      const result = await authService['refreshSession']();

      expect(refreshSpy).toHaveBeenCalledTimes(1);
      // In live mode, __lh_jwt should not be sent at all
      expect(refreshSpy).toHaveBeenCalledWith(
        {},
        {
          signal: expect.any(AbortSignal),
        },
      );
      expect(result).toEqual(mockRefreshResponse);
      expect(authService['refreshPromise']).toBeNull();
      expect(authService['refreshingSignalAbortController']).toBeNull();
      expect(authService['refreshingSignals'].size).toBe(0);
    });

    it('should successfully refresh session token with __lh_jwt in query (non-live mode)', async () => {
      // Create a new auth service with isLive: false for this test
      const nonLiveAuthService = new AuthSessionService(
        false, // isLive: false
        client,
        new ExternalStore<AuthState>({
          user: null,
          error: null,
          status: 'idle',
        }),
        'http://localhost:3020',
        PUBLISHABLE_KEY,
      );

      const abortController = new AbortController();
      const signal = abortController.signal;
      const localhostJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');
      const mockRefreshResponse = {
        sessionToken: jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret'),
      };

      // Set the localhost JWT cookie
      Cookies.set(LOCALHOST_JWT_COOKIE_NAME, localhostJWT);

      const refreshSpy = vi
        .spyOn(nonLiveAuthService['localClient'].auth, 'refresh')
        .mockResolvedValue(mockRefreshResponse);
      const addEventListenerSpy = vi.spyOn(signal, 'addEventListener');

      const result = await nonLiveAuthService['refreshSession']({ signal });

      expect(addEventListenerSpy).toHaveBeenCalledWith('abort', expect.any(Function));
      expect(refreshSpy).toHaveBeenCalledTimes(1);
      expect(refreshSpy).toHaveBeenCalledWith(
        { __lh_jwt: localhostJWT },
        {
          signal: expect.any(AbortSignal),
        },
      );
      expect(result).toEqual(mockRefreshResponse);
      expect(nonLiveAuthService['refreshPromise']).toBeNull();
      expect(nonLiveAuthService['refreshingSignalAbortController']).toBeNull();
      expect(nonLiveAuthService['refreshingSignals'].size).toBe(0);
    });

    it('should not send __lh_jwt in live mode even if cookie exists', async () => {
      const localhostJWT = jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret');
      const mockRefreshResponse = {
        sessionToken: jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret'),
      };

      // Set the localhost JWT cookie (should be ignored in live mode)
      Cookies.set(LOCALHOST_JWT_COOKIE_NAME, localhostJWT);

      const refreshSpy = vi
        .spyOn(authService['localClient'].auth, 'refresh')
        .mockResolvedValue(mockRefreshResponse);

      const result = await authService['refreshSession']();

      expect(refreshSpy).toHaveBeenCalledTimes(1);
      // In live mode, __lh_jwt should not be sent even if cookie exists
      expect(refreshSpy).toHaveBeenCalledWith(
        {},
        {
          signal: expect.any(AbortSignal),
        },
      );
      expect(result).toEqual(mockRefreshResponse);
    });

    it('should deduplicate concurrent refresh requests', async () => {
      let resolvePromise: (value: { sessionToken: string }) => void;
      const delayedPromise = new Promise<{ sessionToken: string }>((resolve) => {
        resolvePromise = resolve;
      });

      const mockRefreshResponse = {
        sessionToken: jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret'),
      };

      const refreshSpy = vi
        .spyOn(authService['localClient'].auth, 'refresh')
        .mockReturnValue(delayedPromise);

      const promise1 = authService['refreshSession']();
      const promise2 = authService['refreshSession']();
      const promise3 = authService['refreshSession']();

      expect(refreshSpy).toHaveBeenCalledTimes(1);
      // All calls should share the same underlying refreshPromise
      expect(authService['refreshPromise']).toBeDefined();
      const sharedPromise = authService['refreshPromise'];
      expect(sharedPromise).toBe(sharedPromise);

      resolvePromise!(mockRefreshResponse);

      const results = await Promise.all([promise1, promise2, promise3]);

      expect(results[0]).toEqual(mockRefreshResponse);
      expect(results[1]).toEqual(mockRefreshResponse);
      expect(results[2]).toEqual(mockRefreshResponse);
      expect(authService['refreshPromise']).toBeNull();
      expect(authService['refreshingSignalAbortController']).toBeNull();
      expect(authService['refreshingSignals'].size).toBe(0);
    });

    it('should abort refresh request when all signals are aborted', async () => {
      const abortController1 = new AbortController();
      const abortController2 = new AbortController();
      const signal1 = abortController1.signal;
      const signal2 = abortController2.signal;

      let receivedSignal: AbortSignal | undefined;
      const refreshSpy = vi
        .spyOn(authService['localClient'].auth, 'refresh')
        .mockImplementation(
          (query?: AuthRefreshQuery, init?: Omit<RequestInit, 'method' | 'body'>) => {
            receivedSignal = (init as { signal?: AbortSignal })?.signal;
            return Promise.resolve({
              sessionToken: jwt.sign(ONE_MINUTE_PAYLOAD, 'test_secret'),
            });
          },
        );

      const promise1 = authService['refreshSession']({ signal: signal1 });
      const promise2 = authService['refreshSession']({ signal: signal2 });

      abortController1.abort();
      abortController2.abort();

      await Promise.all([promise1, promise2]);

      expect(refreshSpy).toHaveBeenCalledTimes(1);
      expect(receivedSignal).toBeDefined();
      expect(receivedSignal?.aborted).toBe(true);
    });

    it('should handle errors by calling handleRequestError', async () => {
      const error = new BlimuError('Unauthorized', 401, 'Unauthorized');
      Cookies.set(SESSION_COOKIE_NAME, 'test_token');

      const refreshSpy = vi
        .spyOn(authService['localClient'].auth, 'refresh')
        .mockRejectedValue(error);
      const handleErrorSpy = vi.spyOn(authService, 'handleRequestError');

      const result = await authService['refreshSession']();

      expect(refreshSpy).toHaveBeenCalledTimes(1);
      expect(handleErrorSpy).toHaveBeenCalledWith(error);
      expect(result).toEqual({
        error: 'Unauthorized',
        user: null,
      });
      expect(Cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
    });

    it('should clean up state after error', async () => {
      const error = new BlimuError('Unauthorized', 401, 'Unauthorized');
      const refreshSpy = vi
        .spyOn(authService['localClient'].auth, 'refresh')
        .mockRejectedValue(error);

      await authService['refreshSession']();

      expect(refreshSpy).toHaveBeenCalledTimes(1);
      // State is cleared in the finally block after promise completes
      expect(authService['refreshPromise']).toBeNull();
      expect(authService['refreshingSignalAbortController']).toBeNull();
    });
  });
});
