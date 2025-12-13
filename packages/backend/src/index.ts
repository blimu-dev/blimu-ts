import { CoreClient, ClientOption, FetchError } from './client';
import { BulkResourcesService } from './services/bulk_resources';
import { BulkRolesService } from './services/bulk_roles';
import { EntitlementsService } from './services/entitlements';
import { PlansService } from './services/plans';
import { ResourceMembersService } from './services/resource_members';
import { ResourcesService } from './services/resources';
import { RolesService } from './services/roles';
import { UsageService } from './services/usage';
import { UsersService } from './services/users';

export class Blimu {
  readonly bulkResources: BulkResourcesService;
  readonly bulkRoles: BulkRolesService;
  readonly entitlements: EntitlementsService;
  readonly plans: PlansService;
  readonly resourceMembers: ResourceMembersService;
  readonly resources: ResourcesService;
  readonly roles: RolesService;
  readonly usage: UsageService;
  readonly users: UsersService;

  constructor(options?: ClientOption) {
    const core = new CoreClient(options);
    this.bulkResources = new BulkResourcesService(core);
    this.bulkRoles = new BulkRolesService(core);
    this.entitlements = new EntitlementsService(core);
    this.plans = new PlansService(core);
    this.resourceMembers = new ResourceMembersService(core);
    this.resources = new ResourcesService(core);
    this.roles = new RolesService(core);
    this.usage = new UsageService(core);
    this.users = new UsersService(core);
  }
}

export type { ClientOption };

// Export FetchError for error handling
export { FetchError };
export const BlimuError = FetchError;

// Re-exports for better ergonomics
export * from './utils';
export * as Schema from './schema';
export { BulkResourcesService } from './services/bulk_resources';
export { BulkRolesService } from './services/bulk_roles';
export { EntitlementsService } from './services/entitlements';
export { PlansService } from './services/plans';
export { ResourceMembersService } from './services/resource_members';
export { ResourcesService } from './services/resources';
export { RolesService } from './services/roles';
export { UsageService } from './services/usage';
export { UsersService } from './services/users';
export * from './token-verifier';
