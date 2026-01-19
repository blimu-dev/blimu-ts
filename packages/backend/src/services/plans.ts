import { FetchClient } from '@blimu/fetch';
import * as Schema from '../schema';

export class PlansService {
  constructor(private core: FetchClient) {}

  /**
   * DELETE /v1/resources/{resourceType}/{resourceId}/plan*
   * @summary Remove plan assignment from a tenant resource*
   * @description Removes the billing plan assignment from a tenant resource. After removal, the resource will have no plan and will be subject to default limits.*/
  delete(
    resourceType: string,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.PlanDeleteResponse> {
    return this.core.request({
      method: 'DELETE',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/plan`,
      ...(init ?? {}),
    });
  }

  /**
   * GET /v1/resources/{resourceType}/{resourceId}/plan*
   * @summary Get the plan assigned to a tenant resource*
   * @description Retrieves the billing plan currently assigned to a tenant resource, if any.*/
  read(
    resourceType: string,
    resourceId: string,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<Schema.PlanResponse> {
    return this.core.request({
      method: 'GET',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/plan`,
      ...(init ?? {}),
    });
  }

  /**
   * POST /v1/resources/{resourceType}/{resourceId}/plan*
   * @summary Assign a plan to a tenant resource*
   * @description Assigns a billing plan to a tenant resource. Plans control feature access and usage limits based on your plan definitions. The resource must be marked as a tenant in your resource definitions.*/
  assign(
    resourceType: string,
    resourceId: string,
    body: Schema.PlanAssignBody,
    init?: Omit<RequestInit, 'method' | 'body'>
  ): Promise<unknown> {
    return this.core.request({
      method: 'POST',
      path: `/v1/resources/${encodeURIComponent(resourceType)}/${encodeURIComponent(resourceId)}/plan`,
      body,
      ...(init ?? {}),
    });
  }
}
