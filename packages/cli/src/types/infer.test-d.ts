/**
 * Type-level tests for Infer* utilities.
 * Run with: vitest run --typecheck
 */
import { test, expectTypeOf } from 'vitest';
import type {
  InferResourceTypes,
  InferEntitlementTypes,
  InferPlanTypes,
  InferLimitTypes,
  InferUsageLimitTypes,
} from './infer';

// Sample config shape that matches what the infer types expect.
// Note: InferLimitTypes/InferUsageLimitTypes use keyof (union of plan values),
// which is the *intersection* of keys across plans, not union.
const testConfig = {
  resources: {
    workspace: { roles: ['admin'] as const },
    environment: { roles: ['viewer'] as const },
  },
  entitlements: {
    'workspace:read': { roles: ['admin'] },
    'workspace:create': { roles: ['admin'] },
  },
  plans: {
    free: {
      name: 'Free',
      resource_limits: { workspace_count: 1 },
      usage_based_limits: { api_calls: { value: 0, period: 'monthly' as const } },
    },
    pro: {
      name: 'Pro',
      resource_limits: { workspace_count: 10, env_count: 5 },
      usage_based_limits: {
        api_calls: { value: 1000, period: 'monthly' as const },
      },
    },
  },
} as const;

type TestConfig = typeof testConfig;

test('InferResourceTypes extracts resource keys', () => {
  expectTypeOf<InferResourceTypes<TestConfig>>().toEqualTypeOf<'workspace' | 'environment'>();
});

test('InferEntitlementTypes extracts entitlement keys', () => {
  expectTypeOf<InferEntitlementTypes<TestConfig>>().toEqualTypeOf<
    'workspace:read' | 'workspace:create'
  >();
});

test('InferPlanTypes extracts plan keys', () => {
  expectTypeOf<InferPlanTypes<TestConfig>>().toEqualTypeOf<'free' | 'pro'>();
});

test('InferLimitTypes extracts resource_limits keys from all plans', () => {
  expectTypeOf<InferLimitTypes<TestConfig>>().toEqualTypeOf<'workspace_count' | 'env_count'>();
});

test('InferUsageLimitTypes extracts usage_based_limits keys from all plans', () => {
  expectTypeOf<InferUsageLimitTypes<TestConfig>>().toEqualTypeOf<'api_calls'>();
});

test('InferResourceTypes returns never when config has no resources', () => {
  interface ConfigWithoutResources {
    plans: { free: { name: string } };
  }
  expectTypeOf<InferResourceTypes<ConfigWithoutResources>>().toEqualTypeOf<never>();
});

test('InferPlanTypes returns never when config has no plans', () => {
  interface ConfigWithoutPlans {
    resources: { workspace: { roles: string[] } };
  }
  expectTypeOf<InferPlanTypes<ConfigWithoutPlans>>().toEqualTypeOf<never>();
});
