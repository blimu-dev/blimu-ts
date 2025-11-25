import { CoreClient } from '../client';
import { Schema } from '../schema';

export class EntitlementsService {
  constructor(private core: CoreClient) {}

  /**
   * POST /v1/entitlements/check
   * @summary Check if a user has a specific entitlement on a resource
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
