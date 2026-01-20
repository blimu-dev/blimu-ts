import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { EntitlementGuard } from '../entitlement.guard';
import { ENTITLEMENT_METADATA_KEY } from '../entitlement.guard';
import type { BlimuConfig } from '../../config/blimu.config';
import type { Blimu } from '@blimu/backend';

describe('EntitlementGuard', () => {
  let guard: EntitlementGuard;
  let mockConfig: BlimuConfig<unknown>;
  let mockRuntime: Blimu;
  let mockContext: ExecutionContext;
  let mockRequest: unknown;
  let mockCheckEntitlement: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockRequest = {
      params: { resourceId: 'resource-123' },
      user: { id: 'user-123' },
    };

    mockContext = {
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue(mockRequest),
      }),
      getHandler: vi.fn().mockReturnValue(vi.fn()),
    } as unknown as ExecutionContext;

    mockCheckEntitlement = vi.fn().mockResolvedValue({ allowed: true });

    mockConfig = {
      apiKey: 'test-api-key',
      getUserId: vi.fn().mockResolvedValue('user-123'),
      defaultEntitlementCtxResolver: undefined,
    } as BlimuConfig<unknown>;

    mockRuntime = {
      entitlements: {
        checkEntitlement: mockCheckEntitlement,
      },
    } as unknown as Blimu;

    guard = new EntitlementGuard(mockConfig, mockRuntime);
  });

  describe('when no metadata is present', () => {
    it('should allow access', async () => {
      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, undefined, mockContext.getHandler());

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockCheckEntitlement).not.toHaveBeenCalled();
    });
  });

  describe('when decorator-specific resolver is provided', () => {
    it('should use decorator resolver and allow access', async () => {
      const decoratorResolver = vi.fn().mockResolvedValue({ resourceId: 'resource-123' });
      const metadata = {
        entitlementKey: 'brand:read' as const,
        entitlementCtxResolver: decoratorResolver,
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(decoratorResolver).toHaveBeenCalledWith(mockRequest);
      expect(mockConfig.defaultEntitlementCtxResolver).toBeUndefined();
      expect(mockCheckEntitlement).toHaveBeenCalledWith({
        userId: 'user-123',
        entitlement: 'brand:read',
        resourceId: 'resource-123',
      });
    });

    it('should use decorator resolver with amount', async () => {
      const decoratorResolver = vi
        .fn()
        .mockResolvedValue({ resourceId: 'resource-123', amount: 10 });
      const metadata = {
        entitlementKey: 'organization:make_api_call' as const,
        entitlementCtxResolver: decoratorResolver,
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockCheckEntitlement).toHaveBeenCalledWith({
        userId: 'user-123',
        entitlement: 'organization:make_api_call',
        resourceId: 'resource-123',
        amount: 10,
      });
    });
  });

  describe('when default resolver is provided', () => {
    it('should use default resolver when decorator resolver is not provided', async () => {
      const defaultResolver = vi.fn().mockResolvedValue({ resourceId: 'resource-123' });
      mockConfig.defaultEntitlementCtxResolver = defaultResolver;

      const metadata = {
        entitlementKey: 'brand:read' as const,
        entitlementCtxResolver: undefined,
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(defaultResolver).toHaveBeenCalledWith(
        { entitlement: 'brand:read', resourceType: 'brand' },
        mockRequest,
      );
      expect(mockCheckEntitlement).toHaveBeenCalledWith({
        userId: 'user-123',
        entitlement: 'brand:read',
        resourceId: 'resource-123',
      });
    });

    it('should pass entitlementKey to default resolver', async () => {
      const defaultResolver = vi.fn().mockResolvedValue({ resourceId: 'resource-123' });
      mockConfig.defaultEntitlementCtxResolver = defaultResolver;

      const metadata = {
        entitlementKey: 'workspace:delete' as const,
        entitlementCtxResolver: undefined,
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      await guard.canActivate(mockContext);

      expect(defaultResolver).toHaveBeenCalledWith(
        { entitlement: 'workspace:delete', resourceType: 'workspace' },
        mockRequest,
      );
    });

    it('should parse resourceType correctly from entitlementKey', async () => {
      const defaultResolver = vi.fn().mockResolvedValue({ resourceId: 'resource-123' });
      mockConfig.defaultEntitlementCtxResolver = defaultResolver;

      const metadata = {
        entitlementKey: 'organization:create_workspace' as const,
        entitlementCtxResolver: undefined,
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      await guard.canActivate(mockContext);

      expect(defaultResolver).toHaveBeenCalledWith(
        { entitlement: 'organization:create_workspace', resourceType: 'organization' },
        mockRequest,
      );
    });
  });

  describe('when no resolver is available', () => {
    it('should throw ForbiddenException', async () => {
      const metadata = {
        entitlementKey: 'brand:read' as const,
        entitlementCtxResolver: undefined,
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new ForbiddenException('No entitlement context resolver available'),
      );
    });
  });

  describe('priority order', () => {
    it('should prefer decorator resolver over default resolver', async () => {
      const decoratorResolver = vi.fn().mockResolvedValue({ resourceId: 'decorator-resource' });
      const defaultResolver = vi.fn().mockResolvedValue({ resourceId: 'default-resource' });
      mockConfig.defaultEntitlementCtxResolver = defaultResolver;

      const metadata = {
        entitlementKey: 'brand:read' as const,
        entitlementCtxResolver: decoratorResolver,
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      await guard.canActivate(mockContext);

      expect(decoratorResolver).toHaveBeenCalled();
      expect(defaultResolver).not.toHaveBeenCalled();
      expect(mockCheckEntitlement).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceId: 'decorator-resource',
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should throw ForbiddenException when resourceId is missing', async () => {
      const resolver = vi.fn().mockResolvedValue({ resourceId: undefined });
      const metadata = {
        entitlementKey: 'brand:read' as const,
        entitlementCtxResolver: resolver,
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new ForbiddenException('Resource ID is required for entitlement check'),
      );
    });

    it('should throw ForbiddenException when getUserId fails', async () => {
      mockConfig.getUserId = vi.fn().mockRejectedValue(new Error('Failed to extract user'));

      const metadata = {
        entitlementKey: 'brand:read' as const,
        entitlementCtxResolver: vi.fn().mockResolvedValue({ resourceId: 'resource-123' }),
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new ForbiddenException('Failed to extract user ID from request'),
      );
    });

    it('should throw ForbiddenException when userId is missing', async () => {
      mockConfig.getUserId = vi.fn().mockResolvedValue(undefined);

      const metadata = {
        entitlementKey: 'brand:read' as const,
        entitlementCtxResolver: vi.fn().mockResolvedValue({ resourceId: 'resource-123' }),
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        new ForbiddenException('User ID is required for entitlement check'),
      );
    });

    it('should throw BlimuForbiddenException when entitlement check fails', async () => {
      const { BlimuForbiddenException } =
        await import('../../exceptions/blimu-forbidden.exception');
      const failingCheckEntitlement = vi.fn().mockResolvedValue({
        allowed: false,
        reason: 'insufficient_permissions',
      });
      mockRuntime = {
        entitlements: {
          checkEntitlement: failingCheckEntitlement,
        },
      } as unknown as Blimu;
      guard = new EntitlementGuard(mockConfig, mockRuntime);

      const metadata = {
        entitlementKey: 'brand:read' as const,
        entitlementCtxResolver: vi.fn().mockResolvedValue({ resourceId: 'resource-123' }),
      };

      Reflect.defineMetadata(ENTITLEMENT_METADATA_KEY, metadata, mockContext.getHandler());

      await expect(guard.canActivate(mockContext)).rejects.toThrow(BlimuForbiddenException);
    });
  });
});
