import { ForbiddenException } from '@nestjs/common';
import type { Schema } from '@blimu/backend';

/**
 * Custom exception for Blimu entitlement check failures
 *
 * This exception extends NestJS's ForbiddenException and includes
 * the typed EntitlementCheckResult, providing detailed information
 * about why the entitlement check failed (roles, plans, limits, etc.)
 */
export class BlimuForbiddenException extends ForbiddenException {
  /**
   * The entitlement check result containing detailed failure information
   */
  public readonly entitlementResult: Schema.EntitlementCheckResult;

  /**
   * The entitlement key that was checked
   */
  public readonly entitlementKey: Schema.EntitlementType;

  /**
   * The resource ID that was checked
   */
  public readonly resourceId: string;

  /**
   * The user ID that was checked
   */
  public readonly userId: string;

  constructor(
    entitlementResult: Schema.EntitlementCheckResult,
    entitlementKey: Schema.EntitlementType,
    resourceId: string,
    userId: string,
  ) {
    // Create a user-friendly message based on the failure reason
    const message = BlimuForbiddenException.buildMessage(entitlementResult, entitlementKey);

    super({
      message,
      entitlementResult,
      entitlementKey,
      resourceId,
      userId,
    });

    this.entitlementResult = entitlementResult;
    this.entitlementKey = entitlementKey;
    this.resourceId = resourceId;
    this.userId = userId;
  }

  /**
   * Builds a user-friendly error message from the entitlement check result
   */
  private static buildMessage(
    result: Schema.EntitlementCheckResult,
    entitlementKey: Schema.EntitlementType,
  ): string {
    const reasons: string[] = [];

    if (result.roles && !result.roles.allowed) {
      reasons.push(
        `Insufficient roles. Required: ${result.roles.allowedRoles?.join(', ') || 'unknown'}. User has: ${result.roles.userRoles?.join(', ') || 'none'}.`,
      );
    }

    if (result.plans && !result.plans.allowed) {
      reasons.push(
        `Plan restriction. Required plans: ${result.plans.allowedPlans?.join(', ') || 'unknown'}. Current plan: ${result.plans.plan || 'none'}.`,
      );
    }

    if (result.limit && !result.limit.allowed) {
      reasons.push(`Usage limit exceeded. ${result.limit.reason || 'Limit has been reached'}.`);
    }

    if (reasons.length === 0) {
      return `Access denied for entitlement: ${entitlementKey}`;
    }

    return `Access denied for entitlement "${entitlementKey}": ${reasons.join(' ')}`;
  }
}
