import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  EntitlementGuard,
  SetEntitlementMetadata,
  type EntitlementInfo,
} from '../guards/entitlement.guard';
import type { EntitlementType } from '@blimu/types';

/**
 * Decorator to check if the authenticated user has a specific entitlement on a resource.
 *
 * This decorator combines the entitlement metadata setting and guard application
 * to provide a clean, declarative way to protect routes with entitlement checks.
 *
 * @param entitlementKey - The entitlement key to check (e.g., 'brand:read', 'organization:create_workspace')
 * @param getEntitlementInfo - Function that returns entitlement information including resourceId and optionally amount for usage limits
 *
 * @example
 * Basic usage with path parameter:
 * ```typescript
 * @Get('/:resourceId')
 * @Entitlement('brand:read', (req) => ({ resourceId: req.params.resourceId }))
 * async getBrand(@Param('resourceId') resourceId: string) {
 *   // User is guaranteed to have 'brand:read' entitlement on this resource
 * }
 * ```
 *
 * @example
 * Using with typed parameters:
 * ```typescript
 * @Get('/:resourceType/:resourceId')
 * @Entitlement('workspace:delete', (req) => ({ resourceId: req.params.resourceId }))
 * async deleteResource(@Param() params: ResourceParamsDto) {
 *   // User is guaranteed to have 'workspace:delete' entitlement
 * }
 * ```
 *
 * @example
 * Complex resource ID extraction:
 * ```typescript
 * @Post('/organizations/:orgId/workspaces')
 * @Entitlement('organization:create_workspace', (req) => {
 *   const params = req.params as { orgId: string };
 *   return { resourceId: params.orgId };
 * })
 * async createWorkspace(@Param() params: CreateWorkspaceParamsDto, @Body() body: CreateWorkspaceDto) {
 *   // User is guaranteed to have 'organization:create_workspace' entitlement on the organization
 * }
 * ```
 *
 * @example
 * With usage limit consumption:
 * ```typescript
 * @Post('/api-calls')
 * @Entitlement('organization:make_api_call', (req) => ({
 *   resourceId: req.params.orgId,
 *   amount: req.body.apiCallsCount, // Amount to consume from usage limit
 * }))
 * async makeApiCalls(@Param('orgId') orgId: string, @Body() body: { apiCallsCount: number }) {
 *   // User is guaranteed to have 'organization:make_api_call' entitlement
 *   // and sufficient usage limit balance
 * }
 * ```
 *
 * @example
 * Async entitlement info extraction (e.g., from database):
 * ```typescript
 * @Delete('/items/:itemId')
 * @Entitlement('workspace:delete_item', async (req) => {
 *   // You could fetch the workspace ID from your database
 *   const item = await itemService.findById(req.params.itemId);
 *   return { resourceId: item.workspaceId };
 * })
 * async deleteItem(@Param('itemId') itemId: string) {
 *   // User is guaranteed to have 'workspace:delete_item' entitlement on the item's workspace
 * }
 * ```
 *
 * @example
 * Using with custom request type:
 * ```typescript
 * interface AuthenticatedRequest {
 *   user: { id: string; email: string };
 * }
 *
 * @Get('/:resourceId')
 * @Entitlement<AuthenticatedRequest>('brand:read', (req) => {
 *   // req is typed as AuthenticatedRequest, so req.user is properly typed
 *   console.log(req.user.email); // TypeScript knows this exists
 *   return { resourceId: req.params.resourceId };
 * })
 * async getBrand(@Param('resourceId') resourceId: string) {
 *   // User is guaranteed to have 'brand:read' entitlement on this resource
 * }
 * ```
 */
export const Entitlement = <TRequest = unknown>(
  entitlementKey: EntitlementType,
  getEntitlementInfo: (request: TRequest) => EntitlementInfo | Promise<EntitlementInfo>,
): MethodDecorator => {
  return applyDecorators(
    SetEntitlementMetadata<TRequest>(entitlementKey, getEntitlementInfo),
    UseGuards(EntitlementGuard),
  );
};
