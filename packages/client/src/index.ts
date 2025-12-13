import { CoreClient, ClientOption, FetchError } from './client';
import { AuthService } from './services/auth';

export class Blimu {
  readonly auth: AuthService;

  constructor(options?: ClientOption) {
    const core = new CoreClient(options);
    this.auth = new AuthService(core);
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
