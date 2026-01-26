import { FetchClient, FetchError } from '@blimu/fetch';
import {
  type FetchClientConfig,
  type BearerAuthStrategy,
  type ApiKeyAuthStrategy,
} from '@blimu/fetch';
import { buildAuthStrategies } from './auth-strategies';
import { ApiKeysService } from './services/api_keys';
import { DefinitionsService } from './services/definitions';
import { DnsService } from './services/dns';
import { EnvironmentsService } from './services/environments';
import { MeService } from './services/me';
import { OauthAppsService } from './services/oauth_apps';
import { ResourcesService } from './services/resources';
import { SslService } from './services/ssl';
import { UsersService } from './services/users';
import { WorkspaceMembersService } from './services/workspace_members';
import { WorkspacesService } from './services/workspaces';

export type ClientOption = FetchClientConfig & {
  apiKey?: ApiKeyAuthStrategy['key'];
  bearer?: BearerAuthStrategy['token'];
};

export class BlimuCli {
  readonly apiKeys: ApiKeysService;
  readonly definitions: DefinitionsService;
  readonly dns: DnsService;
  readonly environments: EnvironmentsService;
  readonly me: MeService;
  readonly oauthApps: OauthAppsService;
  readonly resources: ResourcesService;
  readonly ssl: SslService;
  readonly users: UsersService;
  readonly workspaceMembers: WorkspaceMembersService;
  readonly workspaces: WorkspacesService;

  constructor(options?: ClientOption) {
    const restCfg = { ...(options ?? {}) };
    delete restCfg.apiKey;
    delete restCfg.bearer;

    const authStrategies = buildAuthStrategies(options ?? {});

    const core = new FetchClient({
      ...restCfg,
      baseURL: options?.baseURL ?? 'https://runtime.blimu.dev',
      ...(authStrategies.length > 0 ? { authStrategies } : {}),
    });

    this.apiKeys = new ApiKeysService(core);
    this.definitions = new DefinitionsService(core);
    this.dns = new DnsService(core);
    this.environments = new EnvironmentsService(core);
    this.me = new MeService(core);
    this.oauthApps = new OauthAppsService(core);
    this.resources = new ResourcesService(core);
    this.ssl = new SslService(core);
    this.users = new UsersService(core);
    this.workspaceMembers = new WorkspaceMembersService(core);
    this.workspaces = new WorkspacesService(core);
  }
}

// Re-export FetchError for backward compatibility
export { FetchError };
export const BlimuCliError = FetchError;
