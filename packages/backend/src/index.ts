import { CoreClient, ClientOption, ApiError } from './client';
import { BulkResourcesService } from './services/bulk_resources';
import { BulkRolesService } from './services/bulk_roles';
import { EntitlementsService } from './services/entitlements';
import { ResourcesService } from './services/resources';
import { RolesService } from './services/roles';
import { UsersService } from './services/users';

export class Blimu {
  readonly bulkResources: BulkResourcesService;
  readonly bulkRoles: BulkRolesService;
  readonly entitlements: EntitlementsService;
  readonly resources: ResourcesService;
  readonly roles: RolesService;
  readonly users: UsersService;

  constructor(options?: ClientOption) {
    const core = new CoreClient(options);
    this.bulkResources = new BulkResourcesService(core);
    this.bulkRoles = new BulkRolesService(core);
    this.entitlements = new EntitlementsService(core);
    this.resources = new ResourcesService(core);
    this.roles = new RolesService(core);
    this.users = new UsersService(core);
  }
}

export type { ClientOption };

// Export ApiError for error handling
export { ApiError };
export const BlimuError = ApiError;

// Re-exports for better ergonomics
export * from './utils';
export * as Schema from './schema';
export { BulkResourcesService } from './services/bulk_resources';
export { BulkRolesService } from './services/bulk_roles';
export { EntitlementsService } from './services/entitlements';
export { ResourcesService } from './services/resources';
export { RolesService } from './services/roles';
export { UsersService } from './services/users';
