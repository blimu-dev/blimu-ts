import { describe, it, expect, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { BlimuModule } from '../blimu.module';
import { BLIMU_CONFIG } from '../../config/blimu.config';
import { Blimu } from '@blimu/backend';
import { EntitlementGuard } from '../../guards/entitlement.guard';

describe('BlimuModule', () => {
  describe('forRoot', () => {
    it('should register config with all properties', async () => {
      const config = {
        apiKey: 'test-api-key',
        baseURL: 'https://test.api.blimu.dev',
        environmentId: 'test-env-id',
        timeoutMs: 5000,
        getUserId: vi.fn().mockReturnValue('user-123'),
        defaultEntitlementCtxResolver: vi.fn().mockReturnValue({ resourceId: 'resource-123' }),
      };

      const module = await Test.createTestingModule({
        imports: [BlimuModule.forRoot(config)],
      }).compile();

      const injectedConfig = module.get<typeof config>(BLIMU_CONFIG);
      expect(injectedConfig.apiKey).toBe('test-api-key');
      expect(injectedConfig.baseURL).toBe('https://test.api.blimu.dev');
      expect(injectedConfig.environmentId).toBe('test-env-id');
      expect(injectedConfig.timeoutMs).toBe(5000);
      expect(injectedConfig.getUserId).toBe(config.getUserId);
      expect(injectedConfig.defaultEntitlementCtxResolver).toBe(
        config.defaultEntitlementCtxResolver,
      );
    });

    it('should use default values when optional properties are not provided', async () => {
      const config = {
        apiKey: 'test-api-key',
        getUserId: vi.fn().mockReturnValue('user-123'),
      };

      const module = await Test.createTestingModule({
        imports: [BlimuModule.forRoot(config)],
      }).compile();

      const injectedConfig = module.get<typeof config>(BLIMU_CONFIG);
      // @ts-expect-error - injectedConfig is not typed
      expect(injectedConfig.baseURL).toBe('https://api.blimu.dev');
      // @ts-expect-error - injectedConfig is not typed
      expect(injectedConfig.timeoutMs).toBe(30000);
      // @ts-expect-error - injectedConfig is not typed
      expect(injectedConfig.defaultEntitlementCtxResolver).toBeUndefined();
    });

    it('should register Blimu instance', async () => {
      const config = {
        apiKey: 'test-api-key',
        getUserId: vi.fn().mockReturnValue('user-123'),
      };

      const module = await Test.createTestingModule({
        imports: [BlimuModule.forRoot(config)],
      }).compile();

      const blimu = module.get<Blimu>(Blimu);
      expect(blimu).toBeInstanceOf(Blimu);
    });

    it('should register EntitlementGuard', async () => {
      const config = {
        apiKey: 'test-api-key',
        getUserId: vi.fn().mockReturnValue('user-123'),
      };

      const module = await Test.createTestingModule({
        imports: [BlimuModule.forRoot(config)],
      }).compile();

      const guard = module.get<EntitlementGuard>(EntitlementGuard);
      expect(guard).toBeInstanceOf(EntitlementGuard);
    });

    it('should support global module option', () => {
      const config = {
        apiKey: 'test-api-key',
        getUserId: vi.fn().mockReturnValue('user-123'),
        global: true,
      };

      const dynamicModule = BlimuModule.forRoot(config);
      expect(dynamicModule.global).toBe(true);
    });
  });

  describe('forRootAsync', () => {
    it('should register config from async factory', async () => {
      const config = {
        apiKey: 'test-api-key',
        baseURL: 'https://test.api.blimu.dev',
        getUserId: vi.fn().mockReturnValue('user-123'),
        defaultEntitlementCtxResolver: vi.fn().mockReturnValue({ resourceId: 'resource-123' }),
      };

      const module = await Test.createTestingModule({
        imports: [
          BlimuModule.forRootAsync({
            useFactory: () => config,
          }),
        ],
      }).compile();

      const injectedConfig = module.get<typeof config>(BLIMU_CONFIG);
      expect(injectedConfig.apiKey).toBe('test-api-key');
      expect(injectedConfig.defaultEntitlementCtxResolver).toBe(
        config.defaultEntitlementCtxResolver,
      );
    });

    it('should support async factory that returns Promise', async () => {
      const config = {
        apiKey: 'test-api-key',
        getUserId: vi.fn().mockReturnValue('user-123'),
      };

      const module = await Test.createTestingModule({
        imports: [
          BlimuModule.forRootAsync({
            useFactory: async () => {
              await new Promise((resolve) => setTimeout(resolve, 10));
              return config;
            },
          }),
        ],
      }).compile();

      const injectedConfig = module.get<typeof config>(BLIMU_CONFIG);
      expect(injectedConfig.apiKey).toBe('test-api-key');
    });

    it('should support dependency injection', async () => {
      const { Module } = await import('@nestjs/common');
      const CONFIG_SERVICE_TOKEN = 'CONFIG_SERVICE';
      const configService = {
        getApiKey: () => 'injected-api-key',
        getUserId: () => vi.fn().mockReturnValue('user-123'),
      };

      @Module({
        providers: [
          {
            provide: CONFIG_SERVICE_TOKEN,
            useValue: configService,
          },
        ],
        exports: [CONFIG_SERVICE_TOKEN],
      })
      class ConfigModule {}

      const module = await Test.createTestingModule({
        imports: [
          ConfigModule,
          BlimuModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (...args: unknown[]) => {
              const service = args[0] as typeof configService;
              return {
                apiKey: service.getApiKey(),
                getUserId: service.getUserId(),
              };
            },
            inject: [CONFIG_SERVICE_TOKEN],
          }),
        ],
      }).compile();

      const injectedConfig = module.get(BLIMU_CONFIG);
      expect(injectedConfig.apiKey).toBe('injected-api-key');
    });

    it('should use default values when optional properties are not provided', async () => {
      const config = {
        apiKey: 'test-api-key',
        getUserId: vi.fn().mockReturnValue('user-123'),
      };

      const module = await Test.createTestingModule({
        imports: [
          BlimuModule.forRootAsync({
            useFactory: () => config,
          }),
        ],
      }).compile();

      const injectedConfig = module.get(BLIMU_CONFIG);
      expect(injectedConfig.baseURL).toBe('https://api.blimu.dev');
      expect(injectedConfig.timeoutMs).toBe(30000);
    });

    it('should support global module option', () => {
      const config = {
        apiKey: 'test-api-key',
        getUserId: vi.fn().mockReturnValue('user-123'),
      };

      const dynamicModule = BlimuModule.forRootAsync({
        useFactory: () => config,
        global: true,
      });

      expect(dynamicModule.global).toBe(true);
    });
  });
});
