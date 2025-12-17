import { http, HttpResponse } from 'msw';
import Cookies from 'js-cookie';

import { createMockJWT } from './jwt-utils';

const SESSION_COOKIE_NAME = '__bli_session';

/**
 * MSW handlers for Storybook
 * These intercept API calls made by BlimuProvider and components
 * All handlers return authenticated state with valid JWTs
 */
export const handlers = [
  // Auth refresh endpoint - returns authenticated session with valid JWT
  http.post(/https:\/\/.*\/v1\/auth\/refresh/, () => {
    const sessionJWT = createMockJWT('user_123', 'test_environment_id');

    // Set cookie manually (MSW Set-Cookie headers don't always work in browser)
    // Cookies.set(SESSION_COOKIE_NAME, sessionJWT, { path: '/' });

    return HttpResponse.json(
      {
        sessionToken: sessionJWT,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `__bli_session=${sessionJWT}; Path=/; HttpOnly; SameSite=Lax`,
        },
      },
    );
  }),

  // Auth session endpoint - returns authenticated user
  http.get(/https:\/\/.*\/v1\/auth\/session/, ({ request }) => {
    // Check if there's no Authorization header, if not, return 401 to trigger refresh
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      return HttpResponse.json({ error: 'No session' }, { status: 401 });
    }

    return HttpResponse.json(
      {
        user: {
          id: 'user_123',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          emailVerified: true,
        },
      },
      { status: 200 },
    );
  }),

  // Auth logout endpoint
  http.post(/https:\/\/.*\/v1\/auth\/logout/, () => {
    return HttpResponse.json({}, { status: 200 });
  }),

  // Catch-all for any other API calls - return 404 to prevent network errors
  http.all(/https:\/\/.*/, ({ request }) => {
    // Silently handle unhandled requests to prevent console errors
    return HttpResponse.json({ error: 'Not mocked in Storybook' }, { status: 404 });
  }),
];
