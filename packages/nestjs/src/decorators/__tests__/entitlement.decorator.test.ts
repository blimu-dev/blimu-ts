import { describe, it, expect } from 'vitest';
import { Entitlement } from '../entitlement.decorator';
import { ENTITLEMENT_METADATA_KEY } from '../../guards/entitlement.guard';

describe('Entitlement decorator', () => {
  class TestController {
    @Entitlement('brand:read', (req) => ({ resourceId: req.params.resourceId }))
    methodWithResolver(this: void) {
      return 'test';
    }

    @Entitlement('brand:read')
    methodWithoutResolver(this: void) {
      return 'test';
    }

    @Entitlement('organization:make_api_call', (req) => ({
      resourceId: req.params.orgId,
      amount: req.body?.apiCallsCount,
    }))
    methodWithAmount(this: void) {
      return 'test';
    }
  }

  it('should set metadata with resolver when provided', () => {
    const controller = new TestController();
    const metadata = Reflect.getMetadata(ENTITLEMENT_METADATA_KEY, controller.methodWithResolver);

    expect(metadata).toBeDefined();
    expect(metadata.entitlementKey).toBe('brand:read');
    expect(metadata.entitlementCtxResolver).toBeDefined();
    expect(typeof metadata.entitlementCtxResolver).toBe('function');

    // Test resolver function
    const mockRequest = { params: { resourceId: 'test-resource' } };
    const result = metadata.entitlementCtxResolver(mockRequest);
    expect(result).toEqual({ resourceId: 'test-resource' });
  });

  it('should set metadata without resolver when not provided', () => {
    const controller = new TestController();
    const metadata = Reflect.getMetadata(
      ENTITLEMENT_METADATA_KEY,
      controller.methodWithoutResolver,
    );

    expect(metadata).toBeDefined();
    expect(metadata.entitlementKey).toBe('brand:read');
    expect(metadata.entitlementCtxResolver).toBeUndefined();
  });

  it('should handle resolver with amount', () => {
    const controller = new TestController();
    const metadata = Reflect.getMetadata(ENTITLEMENT_METADATA_KEY, controller.methodWithAmount);

    expect(metadata).toBeDefined();
    expect(metadata.entitlementKey).toBe('organization:make_api_call');

    const mockRequest = {
      params: { orgId: 'org-123' },
      body: { apiCallsCount: 10 },
    };
    const result = metadata.entitlementCtxResolver(mockRequest);
    expect(result).toEqual({ resourceId: 'org-123', amount: 10 });
  });

  it('should support async resolvers', async () => {
    class AsyncController {
      @Entitlement('brand:read', async (req) => {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 10));
        return { resourceId: req.params.resourceId };
      })
      asyncMethod(this: void) {
        return 'test';
      }
    }

    const controller = new AsyncController();
    const metadata = Reflect.getMetadata(ENTITLEMENT_METADATA_KEY, controller.asyncMethod);

    expect(metadata).toBeDefined();
    expect(metadata.entitlementCtxResolver).toBeDefined();

    const mockRequest = { params: { resourceId: 'async-resource' } };
    const result = await metadata.entitlementCtxResolver(mockRequest);
    expect(result).toEqual({ resourceId: 'async-resource' });
  });
});
