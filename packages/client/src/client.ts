import { FetchClient, FetchError } from '@blimu/fetch';
import { type FetchClientConfig, type BearerAuthStrategy } from '@blimu/fetch';
import { buildAuthStrategies } from './auth-strategies';
import { AuthService } from './services/auth';
import { EntitlementsService } from './services/entitlements';

export type ClientOption = FetchClientConfig & {
  bearer?: BearerAuthStrategy['token'];
};

export class Blimu {
  readonly auth: AuthService;
  readonly entitlements: EntitlementsService;

  constructor(options?: ClientOption) {
    const restCfg = { ...(options ?? {}) };
    delete restCfg.bearer;

    const authStrategies = buildAuthStrategies(options ?? {});

    const core = new FetchClient({
      ...restCfg,
      baseURL: options?.baseURL ?? 'https://api.blimu.dev',
      ...(authStrategies.length > 0 ? { authStrategies } : {}),
    });

    this.auth = new AuthService(core);
    this.entitlements = new EntitlementsService(core);
  }
}

// Re-export FetchError for backward compatibility
export { FetchError };
export const BlimuError = FetchError;
