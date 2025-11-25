import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Blimu, Schema } from '@blimu/backend';
import type { BlimuConfig } from '../config/blimu.config';
import { BLIMU_CONFIG } from '../config/blimu.config';

export const ENTITLEMENT_KEY = 'entitlement';
export const ENTITLEMENT_METADATA_KEY = Symbol('entitlement');

/**
 * Metadata interface for entitlement checks
 */
export interface EntitlementMetadata<TRequest = any> {
  entitlementKey: Schema.EntitlementType;
  resourceIdExtractor: (request: TRequest) => string | Promise<string>;
}

/**
 * Sets entitlement metadata for a route handler
 * @internal This is used internally by the @Entitlement decorator
 */
export const SetEntitlementMetadata = <TRequest = any>(
  entitlementKey: string,
  resourceIdExtractor: (request: TRequest) => string | Promise<string>,
) =>
  SetMetadata(ENTITLEMENT_METADATA_KEY, {
    entitlementKey,
    resourceIdExtractor,
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
export class EntitlementGuard<TRequest = any> implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(BLIMU_CONFIG)
    private readonly config: BlimuConfig<TRequest>,
    @Inject(Blimu)
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
    } catch (error) {
      throw new ForbiddenException('Failed to extract user ID from request');
    }

    if (!userId) {
      throw new ForbiddenException('User ID is required for entitlement check');
    }

    // Extract resourceId from request
    const resourceId = await metadata.resourceIdExtractor(request);

    if (!resourceId) {
      throw new ForbiddenException('Resource ID is required for entitlement check');
    }

    try {
      // Check entitlement
      const result = await this.runtime.entitlements.checkEntitlement({
        userId,
        entitlement: metadata.entitlementKey,
        resourceId,
      });

      if (!result.allowed) {
        throw new ForbiddenException(
          result.reason || `User does not have required entitlement: ${metadata.entitlementKey}`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      // Log the error for debugging but don't expose internal details
      console.error('Entitlement check failed:', error);
      throw new ForbiddenException('Failed to verify entitlements');
    }
  }
}
