import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  Inject,
} from '@nestjs/common';
import 'reflect-metadata';

import type { EntitlementType } from '@blimu/types';
import { BlimuForbiddenException } from '../exceptions/blimu-forbidden.exception';
import { Blimu } from '@blimu/backend';
import { BLIMU_CONFIG, type BlimuConfig } from '../config/blimu.config';

export const ENTITLEMENT_KEY = 'entitlement';
export const ENTITLEMENT_METADATA_KEY = Symbol('entitlement');

/**
 * Entitlement context returned by the entitlementCtxResolver callback
 */
export interface EntitlementCtx {
  resourceId: string;
  amount?: number; // Amount to check against usage limit (for consumption)
}

/**
 * Metadata interface for entitlement checks
 */
export interface EntitlementMetadata<TRequest = unknown> {
  entitlementKey: EntitlementType;
  entitlementCtxResolver?: (request: TRequest) => EntitlementCtx | Promise<EntitlementCtx>;
}

/**
 * Sets entitlement metadata for a route handler
 * @internal This is used internally by the @Entitlement decorator
 */
export const SetEntitlementMetadata = <TRequest = unknown>(
  entitlementKey: string,
  entitlementCtxResolver?: (request: TRequest) => EntitlementCtx | Promise<EntitlementCtx>,
): MethodDecorator =>
  SetMetadata(ENTITLEMENT_METADATA_KEY, {
    entitlementKey,
    entitlementCtxResolver,
  } as EntitlementMetadata<TRequest>);

/**
 * Guard that checks if the authenticated user has the required entitlement on a resource
 *
 * This guard automatically:
 * 1. Extracts the user from the request
 * 2. Extracts the resource ID using the provided extractor function
 * 3. Calls the Blimu Runtime API to check entitlements
 * 4. Allows or denies access based on the result
 */
@Injectable()
export class EntitlementGuard<TRequest = unknown> implements CanActivate {
  constructor(
    @Inject(BLIMU_CONFIG)
    private readonly config: BlimuConfig<TRequest>,
    @Inject(Blimu)
    private readonly runtime: Blimu,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TRequest>();
    const handler = context.getHandler();
    const metadata = Reflect.getMetadata(ENTITLEMENT_METADATA_KEY, handler) as
      | EntitlementMetadata<TRequest>
      | undefined;

    if (!metadata) {
      // No entitlement check required
      return true;
    }

    // Extract user ID using the configured getUserId function
    let userId: string;
    try {
      userId = await this.config.getUserId(request);
    } catch {
      throw new ForbiddenException('Failed to extract user ID from request');
    }

    if (!userId) {
      throw new ForbiddenException('User ID is required for entitlement check');
    }

    // Resolve entitlement context from request
    // Priority: decorator resolver > default resolver > error
    let entitlementCtx: EntitlementCtx | undefined;
    if (metadata.entitlementCtxResolver) {
      entitlementCtx = await metadata.entitlementCtxResolver(request);
    } else if (this.config.defaultEntitlementCtxResolver) {
      // Parse resourceType from entitlementKey (format: "resourceType:action")
      const resourceType = metadata.entitlementKey.split(':')[0] || '';
      entitlementCtx = await this.config.defaultEntitlementCtxResolver(
        {
          entitlement: metadata.entitlementKey,
          resourceType,
        },
        request,
      );
    } else {
      throw new ForbiddenException('No entitlement context resolver available');
    }

    if (!entitlementCtx?.resourceId) {
      throw new ForbiddenException('Resource ID is required for entitlement check');
    }

    try {
      // Check entitlement
      const result = await this.runtime.entitlements.checkEntitlement({
        userId,
        entitlement: metadata.entitlementKey,
        resourceId: entitlementCtx.resourceId,
        ...(entitlementCtx.amount !== undefined ? { amount: entitlementCtx.amount } : {}),
      });

      if (!result.allowed) {
        throw new BlimuForbiddenException(
          result,
          metadata.entitlementKey,
          entitlementCtx.resourceId,
          userId,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof BlimuForbiddenException || error instanceof ForbiddenException) {
        throw error;
      }

      // Log the error for debugging but don't expose internal details
      console.error('Entitlement check failed:', error);
      throw new ForbiddenException('Failed to verify entitlements');
    }
  }
}
