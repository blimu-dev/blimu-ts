import {
  Module,
  type DynamicModule,
  type Type,
  type ForwardReference,
  type InjectionToken,
  type OptionalFactoryDependency,
} from '@nestjs/common';

import { BLIMU_CONFIG, type BlimuConfig } from '../config/blimu.config';
import { EntitlementGuard } from '../guards/entitlement.guard';
import { JWKService } from '../services/jwk.service';
import { Blimu } from '@blimu/backend';

const DEFAULT_BASE_URL = 'https://api.blimu.dev';

/**
 * Blimu NestJS Module
 *
 * This module provides entitlement checking capabilities and Blimu Runtime SDK integration
 * for NestJS applications. It can be configured synchronously or asynchronously.
 */
@Module({})
export class BlimuModule {
  /**
   * Configure the Blimu module with static configuration
   *
   * @param config - The Blimu configuration object
   * @returns A configured dynamic module
   *
   * @example
   * Basic usage with default Request type:
   * ```typescript
   * @Module({
   *   imports: [
   *     BlimuModule.forRoot({
   *       apiKey: 'your-api-secret-key',
   *       baseURL: 'https://api.blimu.dev', // optional
   *       environmentId: 'your-environment-id', // optional
   *       timeoutMs: 30000, // optional
   *       getUserId: (req) => req.user?.id, // required
   *       defaultEntitlementCtxResolver: ({ entitlement, resourceType }, req) => ({
   *         resourceId: req.params.resourceId,
   *       }), // optional
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   *
   * @example
   * Usage with custom request type:
   * ```typescript
   * interface AuthenticatedRequest {
   *   user: { id: string; email: string };
   * }
   *
   * @Module({
   *   imports: [
   *     BlimuModule.forRoot<AuthenticatedRequest>({
   *       apiKey: 'your-api-secret-key',
   *       getUserId: (req) => req.user.id, // req is typed as AuthenticatedRequest
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   */
  static forRoot<TRequest = unknown>(config: BlimuConfig<TRequest>): DynamicModule {
    return {
      ...(config.global ? { global: true } : {}),
      module: BlimuModule,
      providers: [
        // Register factory providers first so dependencies are available
        {
          provide: BLIMU_CONFIG,
          useValue: {
            apiKey: config.apiKey,
            baseURL: config.baseURL ?? DEFAULT_BASE_URL,
            environmentId: config.environmentId,
            timeoutMs: config.timeoutMs ?? 30000,
            getUserId: config.getUserId,
            defaultEntitlementCtxResolver: config.defaultEntitlementCtxResolver,
          },
        },
        {
          provide: Blimu,
          useFactory: (config: BlimuConfig) => {
            return new Blimu({
              apiKey: config.apiKey,
              baseURL: config.baseURL ?? DEFAULT_BASE_URL,
              timeoutMs: config.timeoutMs ?? 30000,
            });
          },
          inject: [BLIMU_CONFIG],
        },
        // Register class providers after their dependencies are available
        EntitlementGuard,
        JWKService,
      ],
      exports: [EntitlementGuard, Blimu, BLIMU_CONFIG, JWKService],
    };
  }

  /**
   * Configure the Blimu module with async configuration
   *
   * This is useful when you need to load configuration from environment variables,
   * configuration services, or other async sources.
   *
   * @param options - Async configuration options
   * @returns A configured dynamic module
   *
   * @example
   * Using with ConfigService:
   * ```typescript
   * @Module({
   *   imports: [
   *     ConfigModule.forRoot(),
   *     BlimuModule.forRootAsync({
   *       useFactory: (configService: ConfigService) => ({
   *         apiKey: configService.get('BLIMU_API_SECRET_KEY'),
   *         baseURL: configService.get('BLIMU_BASE_URL'),
   *         environmentId: configService.get('BLIMU_ENVIRONMENT_ID'),
   *         timeoutMs: configService.get('BLIMU_TIMEOUT_MS'),
   *         getUserId: (req) => req.user?.id,
   *         defaultEntitlementCtxResolver: (entitlementKey, req) => ({
   *           resourceId: req.params.resourceId,
   *         }),
   *       }),
   *       inject: [ConfigService],
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   *
   * @example
   * Using with custom request type:
   * ```typescript
   * interface AuthenticatedRequest {
   *   user: { id: string; email: string };
   * }
   *
   * @Module({
   *   imports: [
   *     BlimuModule.forRootAsync<AuthenticatedRequest>({
   *       useFactory: (configService: ConfigService) => ({
   *         apiKey: configService.get('BLIMU_API_SECRET_KEY'),
   *         getUserId: (req) => req.user.id, // req is typed as AuthenticatedRequest
   *       }),
   *       inject: [ConfigService],
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   *
   * @example
   * Using with custom provider:
   * ```typescript
   * @Module({
   *   imports: [
   *     BlimuModule.forRootAsync({
   *       imports: [MyConfigModule],
   *       useFactory: async (myConfigService: MyConfigService) => {
   *         const config = await myConfigService.getBlimuConfig();
   *         return {
   *           apiKey: config.apiKey,
   *           baseURL: config.baseUrl,
   *           environmentId: config.environmentId,
   *           getUserId: (req) => req.user?.id,
   *         };
   *       },
   *       inject: [MyConfigService],
   *     }),
   *   ],
   * })
   * export class AppModule {}
   * ```
   */
  static forRootAsync<TRequest = unknown>(options: {
    global?: boolean | undefined;
    useFactory: (...args: unknown[]) => Promise<BlimuConfig<TRequest>> | BlimuConfig<TRequest>;
    inject?: (InjectionToken | OptionalFactoryDependency)[];
    imports?: (
      | Type<unknown>
      | DynamicModule
      | Promise<DynamicModule>
      | ForwardReference<() => Type<unknown>>
    )[];
  }): DynamicModule {
    const additionalImports = options.imports ?? [];

    const module = {
      ...(options.global ? { global: true } : {}),
      module: BlimuModule,
      imports: [...additionalImports] as (
        | Type<unknown>
        | DynamicModule
        | Promise<DynamicModule>
        | ForwardReference
      )[],
      providers: [
        // Register factory providers first so dependencies are available
        {
          provide: BLIMU_CONFIG,
          useFactory: async (...args: unknown[]) => {
            const configResult = options.useFactory(...args);
            const config = configResult instanceof Promise ? await configResult : configResult;
            return {
              apiKey: config.apiKey,
              baseURL: config.baseURL ?? DEFAULT_BASE_URL,
              environmentId: config.environmentId,
              timeoutMs: config.timeoutMs ?? 30000,
              getUserId: config.getUserId,
              defaultEntitlementCtxResolver: config.defaultEntitlementCtxResolver,
            };
          },
          ...(options.inject ? { inject: options.inject } : {}),
        },
        {
          provide: Blimu,
          useFactory: (config: BlimuConfig) => {
            return new Blimu({
              apiKey: config.apiKey,
              baseURL: config.baseURL ?? DEFAULT_BASE_URL,
              timeoutMs: config.timeoutMs ?? 30000,
            });
          },
          inject: [BLIMU_CONFIG],
        },
        // Register class providers after their dependencies are available
        EntitlementGuard,
        JWKService,
      ],
      exports: [EntitlementGuard, Blimu, BLIMU_CONFIG, JWKService],
    };
    return module;
  }
}
