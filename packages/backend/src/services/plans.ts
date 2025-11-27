import { CoreClient } from '../client';
import * as Schema from '../schema';

export class PlansService {
  constructor(private core: CoreClient) {}

  /**
   * DELETE /v1/resources/{resourceType}/{resourceId}/plan
   * @summary Remove plan assignment from a tenant resource
   */
  delete(
    resourceType: Schema.ResourceType,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.PlanDeleteResponse> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/plan`,
      ...(init || {}),
    });
  }

  /**
   * GET /v1/resources/{resourceType}/{resourceId}/plan
   * @summary Get the plan assigned to a tenant resource
   */
  read(
    resourceType: Schema.ResourceType,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<Schema.PlanResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/plan`,
      ...(init || {}),
    });
  }

  /**
   * POST /v1/resources/{resourceType}/{resourceId}/plan
   * @summary Assign a plan to a tenant resource
   */
  assign(
    resourceType: Schema.ResourceType,
    resourceId: string,
    body: Schema.PlanAssignBody,
    init?: Omit<RequestInit, 'method' | 'body'>,
  ): Promise<unknown> {
    return this.core.request({
      method: 'POST',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/plan`,
      headers: { ...(init?.headers || {}), 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...(init || {}),
    });
  }
}
