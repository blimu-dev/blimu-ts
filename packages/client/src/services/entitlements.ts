import { CoreClient } from '../client';
import * as Schema from '../schema';

export class EntitlementsService {
  constructor(private core: CoreClient) {}

  /**
   * GET /v1/client/entitlements/list-for-tenant/{tenantResourceId}
   * @summary List entitlements for a tenant and all its sub-resources
   *
   * @description Returns entitlements for a tenant resource and all its descendant resources for the authenticated user. This endpoint scopes queries to a single tenant, preventing cross-tenant data access. Only evaluates roles and plans (excludes limits). Results are cached per resource for performance. The tenant resource type is automatically determined from the environment definition (resource marked as `is_tenant: true`).
   */
  listForTenant(
    tenantResourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.EntitlementsListResult> {
    return this.core.request({
      method: 'GET',
      path: `/v1/client/entitlements/list-for-tenant/${encodeURIComponent(tenantResourceId)}`,
      ...(init || {}),
    });
  }

  /**
   * @summary Get query keys for listForTenant
   * @returns ['v1/client/entitlements/list-for-tenant', tenantResourceId]
   */
  listForTenant__queryKeys(tenantResourceId: string) {
    return ['v1/client/entitlements/list-for-tenant', tenantResourceId] as const;
  }
}
