import { describe, expect, it } from 'vitest';
import { defineConfig } from './define-config';
import { z } from 'zod';

describe('defineConfig', () => {
  it('should validate and return a valid config', () => {
    const config = defineConfig({
      resources: {
        workspace: {
          roles: ['admin', 'editor', 'viewer'],
          is_tenant: true,
        },
      },
    });

    expect(config.resources).toBeDefined();
    expect(config.resources.workspace).toBeDefined();
    expect(config.resources.workspace.roles).toEqual(['admin', 'editor', 'viewer']);
    expect(config.resources.workspace.is_tenant).toBe(true);
  });

  it('should validate a complete config with all sections', () => {
    const config = defineConfig({
      resources: {
        workspace: {
          roles: ['admin', 'editor'],
          is_tenant: true,
        },
        environment: {
          roles: ['admin', 'viewer'],
          parents: {
            workspace: { required: true },
          },
        },
      },
      entitlements: {
        'workspace:read': {
          roles: ['admin', 'editor', 'viewer'],
        },
        'workspace:create': {
          roles: ['admin'],
          plans: ['pro'],
        },
      },
      plans: {
        free: {
          name: 'Free Plan',
          resource_limits: {
            environments_per_workspace: 1,
          },
        },
        pro: {
          name: 'Pro Plan',
          resource_limits: {
            environments_per_workspace: 10,
          },
          usage_based_limits: {
            tokens: { value: 10000, period: 'monthly' },
          },
        },
      },
      features: {
        workspace_management: {
          name: 'Workspace Management',
          entitlements: ['workspace:read', 'workspace:create'],
        },
      },
    });

    expect(config.resources).toBeDefined();
    expect(config.entitlements).toBeDefined();
    expect(config.plans).toBeDefined();
    expect(config.features).toBeDefined();
  });

  it('should throw error for invalid config - missing resources', () => {
    expect(() => {
      defineConfig({} as any);
    }).toThrow(z.ZodError);
  });

  it('should throw error for invalid config - empty roles array', () => {
    expect(() => {
      defineConfig({
        resources: {
          workspace: {
            roles: [],
          },
        },
      });
    }).toThrow(z.ZodError);
  });

  it('should throw error for invalid config - invalid roles_inheritance format', () => {
    expect(() => {
      defineConfig({
        resources: {
          workspace: {
            roles: ['admin'],
            roles_inheritance: {
              editor: ['invalid->format->->'],
            },
          },
        },
      });
    }).toThrow(z.ZodError);
  });

  it('should validate valid roles_inheritance format', () => {
    const config = defineConfig({
      resources: {
        workspace: {
          roles: ['admin', 'editor'],
          roles_inheritance: {
            editor: ['organization->admin', 'organization->editor'],
          },
        },
      },
    });

    expect(config.resources.workspace.roles_inheritance).toBeDefined();
  });

  it('should validate plan with resource_limits and usage_based_limits', () => {
    const config = defineConfig({
      resources: {
        workspace: {
          roles: ['admin'],
        },
      },
      plans: {
        pro: {
          name: 'Pro Plan',
          resource_limits: {
            environments_per_workspace: 10,
          },
          usage_based_limits: {
            tokens: { value: 10000, period: 'monthly' },
            api_calls: { value: 50000, period: 'yearly' },
          },
        },
      },
    });

    expect(config.plans?.pro.resource_limits).toBeDefined();
    expect(config.plans?.pro.usage_based_limits).toBeDefined();
  });

  it('should throw error for invalid usage_based_limits period', () => {
    expect(() => {
      defineConfig({
        resources: {
          workspace: {
            roles: ['admin'],
          },
        },
        plans: {
          pro: {
            name: 'Pro Plan',
            usage_based_limits: {
              tokens: { value: 10000, period: 'invalid' as any },
            },
          },
        },
      });
    }).toThrow(z.ZodError);
  });

  it('should allow optional sections', () => {
    const config = defineConfig({
      resources: {
        workspace: {
          roles: ['admin'],
        },
      },
    });

    expect(config.resources).toBeDefined();
    expect(config.entitlements).toBeUndefined();
    expect(config.plans).toBeUndefined();
    expect(config.features).toBeUndefined();
  });
});
