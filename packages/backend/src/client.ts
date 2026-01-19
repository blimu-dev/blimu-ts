import { FetchClient, FetchError } from '@blimu/fetch';
import { type FetchClientConfig, type ApiKeyAuthStrategy } from '@blimu/fetch';
import { buildAuthStrategies } from './auth-strategies';
import { BulkResourcesService } from './services/bulk_resources';
import { BulkRolesService } from './services/bulk_roles';
import { EntitlementsService } from './services/entitlements';
import { PlansService } from './services/plans';
import { ResourceMembersService } from './services/resource_members';
import { ResourcesService } from './services/resources';
import { RolesService } from './services/roles';
import { UsageService } from './services/usage';
import { UsersService } from './services/users';

export type ClientOption = FetchClientConfig & {
  apiKey?: ApiKeyAuthStrategy['key'];
};

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
    const restCfg = { ...(options ?? {}) };
    delete restCfg.apiKey;

    const authStrategies = buildAuthStrategies(options ?? {});

    const core = new FetchClient({
      ...restCfg,
      baseURL: options?.baseURL ?? 'https://api.blimu.dev',
      ...(authStrategies.length > 0 ? { authStrategies } : {}),
    });

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

// Re-export FetchError for backward compatibility
export { FetchError };
export const BlimuError = FetchError;
