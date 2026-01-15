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

// Export FetchError and CoreClient for error handling and advanced usage
export { FetchError, CoreClient };
// Re-export all error types from @blimu/fetch for instanceof checks
export * from '@blimu/fetch';
export const BlimuError = FetchError;

// Re-exports for better ergonomics
export * from './utils';
export * as Schema from './schema';
export * as ZodSchema from './schema.zod';
export { AuthService } from './services/auth';
export { EntitlementsService } from './services/entitlements';
