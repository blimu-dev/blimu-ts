import { applyDecorators, UseGuards } from '@nestjs/common';
import { EntitlementGuard, SetEntitlementMetadata } from '../guards/entitlement.guard';
import { Schema } from '@blimu/backend';

/**
 * Decorator to check if the authenticated user has a specific entitlement on a resource.
 *
 * This decorator combines the entitlement metadata setting and guard application
 * to provide a clean, declarative way to protect routes with entitlement checks.
 *
 * @param entitlementKey - The entitlement key to check (e.g., 'brand:read', 'organization:create_workspace')
 * @param resourceIdExtractor - Function that extracts the resourceId from the request
 *
 * @example
 * Basic usage with path parameter:
 * ```typescript
 * @Get('/:resourceId')
 * @Entitlement('brand:read', (req) => req.params.resourceId)
 * async getBrand(@Param('resourceId') resourceId: string) {
 *   // User is guaranteed to have 'brand:read' entitlement on this resource
 * }
 * ```
 *
 * @example
 * Using with typed parameters:
 * ```typescript
 * @Get('/:resourceType/:resourceId')
 * @Entitlement('workspace:delete', (req) => req.params.resourceId)
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
 *   return params.orgId;
 * })
 * async createWorkspace(@Param() params: CreateWorkspaceParamsDto, @Body() body: CreateWorkspaceDto) {
 *   // User is guaranteed to have 'organization:create_workspace' entitlement on the organization
 * }
 * ```
 *
 * @example
 * Async resource ID extraction (e.g., from database):
 * ```typescript
 * @Delete('/items/:itemId')
 * @Entitlement('workspace:delete_item', async (req) => {
 *   // You could fetch the workspace ID from your database
 *   const item = await itemService.findById(req.params.itemId);
 *   return item.workspaceId;
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
 *   return req.params.resourceId;
 * })
 * async getBrand(@Param('resourceId') resourceId: string) {
 *   // User is guaranteed to have 'brand:read' entitlement on this resource
 * }
 * ```
 */
export const Entitlement = <TRequest = any>(
  entitlementKey: Schema.EntitlementType,
  resourceIdExtractor: (request: TRequest) => string | Promise<string>,
) => {
  return applyDecorators(
    SetEntitlementMetadata<TRequest>(entitlementKey, resourceIdExtractor),
    UseGuards(EntitlementGuard),
  );
};
