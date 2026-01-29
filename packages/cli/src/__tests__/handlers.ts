import { http, HttpResponse } from 'msw';

const PLATFORM_API_BASE = 'https://platform.blimu.dev';
const RUNTIME_API_BASE = 'https://runtime.blimu.dev';

/**
 * MSW handlers for CLI integration tests
 */
export const handlers = [
  // Platform API - Definitions endpoints
  http.put(
    `${PLATFORM_API_BASE}/v1/workspace/:workspaceId/environments/:environmentId/definitions`,
    async ({ params, request }) => {
      const { workspaceId, environmentId } = params;
      const body = await request.json();

      // Validate workspace and environment IDs
      if (!workspaceId || !environmentId) {
        return HttpResponse.json(
          { error: 'Workspace ID and Environment ID are required' },
          { status: 400 }
        );
      }

      // Validate authentication
      const authHeader = request.headers.get('authorization');
      if (!authHeader) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Return success response
      return HttpResponse.json(
        {
          workspaceId,
          environmentId,
          definitions: body,
          updatedAt: new Date().toISOString(),
        },
        { status: 200 }
      );
    }
  ),

  http.get(
    `${PLATFORM_API_BASE}/v1/workspace/:workspaceId/environments/:environmentId/definitions`,
    ({ request }) => {
      // Validate authentication
      const authHeader = request.headers.get('authorization');
      if (!authHeader) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Return mock definitions
      return HttpResponse.json(
        {
          resources: {
            workspace: {
              roles: ['admin', 'editor', 'viewer'],
            },
          },
          entitlements: {},
          features: {},
          plans: {},
        },
        { status: 200 }
      );
    }
  ),

  http.post(
    `${PLATFORM_API_BASE}/v1/workspace/:workspaceId/environments/:environmentId/definitions/validate`,
    async ({ request }) => {
      const body = (await request.json()) as { resources: Record<string, unknown> };

      // Validate authentication
      const authHeader = request.headers.get('authorization');
      if (!authHeader) {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Simple validation - check if resources exist
      const errors: { path: string[]; message: string }[] = [];
      if (!body.resources || Object.keys(body.resources).length === 0) {
        errors.push({
          path: ['resources'],
          message: 'At least one resource must be defined',
        });
      }

      return HttpResponse.json(
        {
          valid: errors.length === 0,
          errors,
        },
        { status: 200 }
      );
    }
  ),

  // Runtime API - OAuth token endpoints
  // Note: The actual endpoint is /v1/oauth/token with JSON body, but we handle both for compatibility
  http.post(`${RUNTIME_API_BASE}/v1/oauth/token`, async ({ request }) => {
    const contentType = request.headers.get('content-type') ?? '';
    let body: {
      grant_type?: string;
      refresh_token?: string;
      client_id?: string;
      code?: string;
      code_verifier?: string;
    };

    if (contentType.includes('application/json')) {
      body = (await request.json()) as typeof body;
    } else {
      const formData = await request.formData();
      body = {
        grant_type: formData.get('grant_type') as string,
        refresh_token: formData.get('refresh_token') as string,
        client_id: formData.get('client_id') as string,
      };
    }

    const grantType = body.grant_type;

    if (grantType === 'refresh_token') {
      const refreshToken = body.refresh_token;
      if (!refreshToken || refreshToken !== 'valid-refresh-token') {
        return HttpResponse.json(
          { error: 'invalid_grant', error_description: 'Invalid refresh token' },
          { status: 400 }
        );
      }

      // Return new access token
      return HttpResponse.json(
        {
          access_token: 'mock-access-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'new-refresh-token',
        },
        { status: 200 }
      );
    }

    if (grantType === 'authorization_code') {
      const code = body.code;
      const codeVerifier = body.code_verifier;

      if (!code || !codeVerifier) {
        return HttpResponse.json(
          { error: 'invalid_request', error_description: 'Missing code or code_verifier' },
          { status: 400 }
        );
      }

      return HttpResponse.json(
        {
          access_token: 'mock-access-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
        },
        { status: 200 }
      );
    }

    return HttpResponse.json({ error: 'unsupported_grant_type' }, { status: 400 });
  }),

  // Runtime API - Device flow endpoints
  http.post(`${RUNTIME_API_BASE}/oauth/device`, async ({ request }) => {
    const body = (await request.json()) as { client_id: string };
    const clientId = body.client_id;

    if (!clientId) {
      return HttpResponse.json(
        { error: 'invalid_client', error_description: 'Missing client_id' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        device_code: 'mock-device-code',
        user_code: 'ABCD-1234',
        verification_uri: 'https://auth.blimu.dev/device',
        verification_uri_complete: 'https://auth.blimu.dev/device?user_code=ABCD-1234',
        expires_in: 600,
        interval: 5,
      },
      { status: 200 }
    );
  }),

  // Me endpoint (for whoami command)
  http.get(`${RUNTIME_API_BASE}/v1/me`, ({ request }) => {
    const authHeader = request.headers.get('authorization') ?? null;
    if (!authHeader) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json(
      {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      },
      { status: 200 }
    );
  }),
];
