import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';
import type { ResourceType } from '@blimu/types';

export class EntitlementsService {
  constructor(private core: FetchClient) {}

  /**
   * POST /v1/entitlements/check*
   * @summary Check if a user has a specific entitlement on a resource*
   * @description Checks whether a user has permission to perform a specific action (entitlement) on a resource. This endpoint evaluates role-based access, plan gating, and usage limits. The response includes detailed information about why access was granted or denied, including which roles were checked, plan requirements, and usage limit status.*/
  checkEntitlement(
    body: Schema.EntitlementCheckBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.EntitlementCheckResult> {
    return this.core.request({
      method: 'POST',
      path: `/v1/entitlements/check`,
      body,
      ...(init || {}),
    });
  }

  /**
   * GET /v1/entitlements/list-for-resource/{resourceType}/{resourceId}*
   * @summary List entitlements for a specific resource*
   * @description Returns entitlements for a specific resource and user. Only evaluates roles and plans (excludes limits). Provides detailed information about why entitlements are allowed or denied, including current roles, allowed roles, current plan, and allowed plans. Results are cached per resource for performance.*/
  listForResource(
    resourceType: ResourceType,
    resourceId: string,
    query?: Schema.EntitlementsListForResourceQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.EntitlementsListResult> {
    return this.core.request({
      method: 'GET',
      path: `/v1/entitlements/list-for-resource/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}`,
      query,
      ...(init || {}),
    });
  }

  /**
   * GET /v1/entitlements/list-for-tenant/{tenantResourceId}*
   * @summary List entitlements for a tenant and all its sub-resources*
   * @description Returns entitlements for a tenant resource and all its descendant resources. This endpoint scopes queries to a single tenant, preventing cross-tenant data access. Only evaluates roles and plans (excludes limits). Results are cached per resource for performance. The tenant resource type is automatically determined from the environment definition (resource marked as `is_tenant: true`).*/
  listForTenant(
    tenantResourceId: string,
    query?: Schema.EntitlementsListForTenantQuery,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.EntitlementsListResult> {
    return this.core.request({
      method: 'GET',
      path: `/v1/entitlements/list-for-tenant/${encodeURIComponent(tenantResourceId)}`,
      query,
      ...(init || {}),
    });
  }
}
