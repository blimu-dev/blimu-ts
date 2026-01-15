import {
  FetchClient,
  FetchError,
  type FetchClientConfig,
  type AuthStrategy,
} from '@blimu/fetch';

export type ClientOption = FetchClientConfig & { apiKey?: string };

// Re-export FetchError for backward compatibility
export { FetchError };

export class CoreClient extends FetchClient {
  constructor(cfg: ClientOption = {}) {
    // Build auth strategies from OpenAPI security schemes
    const authStrategies: AuthStrategy[] = [];

    // Extract auth and security scheme properties to avoid passing them to FetchClient
    const { auth: _existingAuth, apiKey, ...restCfg } = cfg;
    if (cfg?.apiKey) {
      const apiKeyValue = cfg.apiKey;
      authStrategies.push({
        type: 'apiKey',
        key: () => apiKeyValue,
        location: 'header',
        name: 'X-API-KEY',
      });
    } // Build final auth config (merge existing with new strategies)
    const finalAuthStrategies = [
      ...(_existingAuth?.strategies || []),
      ...authStrategies,
    ];

    // Build fetchConfig, ensuring auth comes after restCfg spread to override any existing auth
    const fetchConfig: FetchClientConfig = {
      ...restCfg,
      baseURL: cfg.baseURL ?? 'https://api.blimu.dev',
      // Explicitly set auth after restCfg to ensure it's not overwritten
      // (restCfg might have an auth property that we want to replace)
      ...(finalAuthStrategies.length > 0
        ? {
            auth: {
              strategies: finalAuthStrategies,
            },
          }
        : {}),
      // Hooks are passed through directly from FetchClientConfig (no mapping needed)
    };

    super(fetchConfig);
  }

  async request(
    init: RequestInit & {
      path: string;
      method: string;
      query?: Record<string, any>;
    }
  ) {
    return await super.request(init);
  }

  async *requestStream<T = any>(
    init: RequestInit & {
      path: string;
      method: string;
      query?: Record<string, any>;
      contentType: string;
      streamingFormat?: 'sse' | 'ndjson' | 'chunked';
    }
  ): AsyncGenerator<T, void, unknown> {
    yield* super.requestStream(init);
  }
}
