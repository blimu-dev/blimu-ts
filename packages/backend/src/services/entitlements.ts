import { CoreClient } from '../client';
import * as Schema from '../schema';

export class EntitlementsService {
  constructor(private core: CoreClient) {}

  /**
   * POST /v1/entitlements/check
   * @summary Check if a user has a specific entitlement on a resource
   *
   * @description Checks whether a user has permission to perform a specific action (entitlement) on a resource. This endpoint evaluates role-based access, plan gating, and usage limits. The response includes detailed information about why access was granted or denied, including which roles were checked, plan requirements, and usage limit status.
   */
  checkEntitlement(
    body: Schema.EntitlementCheckBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.EntitlementCheckResult> {
    return this.core.request({
      method: 'POST',
      path: `/v1/entitlements/check`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }
}
