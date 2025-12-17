import { CoreClient, FetchError, type ClientOption } from './client';
import { AuthService } from './services/auth';
import { EntitlementsService } from './services/entitlements';

export class Blimu {
  readonly auth: AuthService;
  readonly entitlements: EntitlementsService;

  constructor(options?: ClientOption) {
    const core = new CoreClient(options);
    this.auth = new AuthService(core);
    this.entitlements = new EntitlementsService(core);
  }
}

export type { ClientOption };

// Export FetchError for error handling
export { FetchError };
export const BlimuError = FetchError;

// Re-exports for better ergonomics
export * from './utils';
export * as Schema from './schema';
export { AuthService } from './services/auth';
export { EntitlementsService } from './services/entitlements';
