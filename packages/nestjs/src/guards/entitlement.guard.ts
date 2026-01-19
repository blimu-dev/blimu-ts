import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { EntitlementType } from '@blimu/types';
import { BlimuForbiddenException } from '../exceptions/blimu-forbidden.exception';
import { Blimu } from '@blimu/backend';
import { BLIMU_CONFIG, type BlimuConfig } from 'config/blimu.config';

export const ENTITLEMENT_KEY = 'entitlement';
export const ENTITLEMENT_METADATA_KEY = Symbol('entitlement');

/**
 * Entitlement information returned by the getEntitlementInfo callback
 */
export interface EntitlementInfo {
  resourceId: string;
  amount?: number; // Amount to check against usage limit (for consumption)
}

/**
 * Metadata interface for entitlement checks
 */
export interface EntitlementMetadata<TRequest = unknown> {
  entitlementKey: EntitlementType;
  getEntitlementInfo: (request: TRequest) => EntitlementInfo | Promise<EntitlementInfo>;
}

/**
 * Sets entitlement metadata for a route handler
 * @internal This is used internally by the @Entitlement decorator
 */
export const SetEntitlementMetadata = <TRequest = unknown>(
  entitlementKey: string,
  getEntitlementInfo: (request: TRequest) => EntitlementInfo | Promise<EntitlementInfo>,
): MethodDecorator =>
  SetMetadata(ENTITLEMENT_METADATA_KEY, {
    entitlementKey,
    getEntitlementInfo,
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
    private readonly reflector: Reflector,
    private readonly runtime: Blimu,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<TRequest>();
    const metadata = this.reflector.get<EntitlementMetadata<TRequest>>(
      ENTITLEMENT_METADATA_KEY,
      context.getHandler(),
    );

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

    // Extract entitlement info from request
    const entitlementInfo = await metadata.getEntitlementInfo(request);

    if (!entitlementInfo?.resourceId) {
      throw new ForbiddenException('Resource ID is required for entitlement check');
    }

    try {
      // Check entitlement
      const result = await this.runtime.entitlements.checkEntitlement({
        userId,
        entitlement: metadata.entitlementKey,
        resourceId: entitlementInfo.resourceId,
        ...(entitlementInfo.amount !== undefined ? { amount: entitlementInfo.amount } : {}),
      });

      if (!result.allowed) {
        throw new BlimuForbiddenException(
          result,
          metadata.entitlementKey,
          entitlementInfo.resourceId,
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
