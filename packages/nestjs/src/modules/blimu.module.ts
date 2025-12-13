import {
  DynamicModule,
  Module,
  Type,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EntitlementGuard } from '../guards/entitlement.guard';
import type { BlimuConfig } from '../config/blimu.config';
import { BLIMU_CONFIG } from '../config/blimu.config';
import { Blimu } from '@blimu/backend';
import { JWKService } from '../services/jwk.service';

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
   *       baseURL: 'https://runtime.blimu.com', // optional
   *       environmentId: 'your-environment-id', // optional
   *       timeoutMs: 30000, // optional
   *       getUserId: (req) => req.user?.id, // required
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
  static forRoot<TRequest = any>(config: BlimuConfig<TRequest>): DynamicModule {
    return {
      module: BlimuModule,
      global: true,
      providers: [
        Reflector,
        EntitlementGuard,
        JWKService,
        {
          provide: BLIMU_CONFIG,
          useValue: {
            apiKey: config.apiKey,
            baseURL: config.baseURL || 'https://runtime.blimu.com',
            environmentId: config.environmentId,
            timeoutMs: config.timeoutMs ?? 30000,
            getUserId: config.getUserId,
          },
        },
        {
          provide: Blimu,
          useFactory: (config: BlimuConfig) =>
            new Blimu({
              apiKey: config.apiKey,
              baseURL: config.baseURL || 'https://runtime.blimu.com',
              timeoutMs: config.timeoutMs ?? 30000,
            }),
          inject: [BLIMU_CONFIG],
        },
      ],
      exports: [Reflector, EntitlementGuard, Blimu, BLIMU_CONFIG, JWKService],
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
  static forRootAsync<TRequest = any>(options: {
    useFactory: (...args: unknown[]) => Promise<BlimuConfig<TRequest>> | BlimuConfig<TRequest>;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    imports?: Array<
      Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference<() => Type<unknown>>
    >;
  }): DynamicModule {
    const additionalImports = options.imports || [];

    return {
      module: BlimuModule,
      global: true,
      imports: [...additionalImports] as Array<
        Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference
      >,
      providers: [
        Reflector,
        EntitlementGuard,
        JWKService,
        {
          provide: BLIMU_CONFIG,
          useFactory: async (...args: unknown[]) => {
            const config = await options.useFactory(...args);
            return {
              apiKey: config.apiKey,
              baseURL: config.baseURL || 'https://runtime.blimu.com',
              environmentId: config.environmentId,
              timeoutMs: config.timeoutMs ?? 30000,
              getUserId: config.getUserId,
            };
          },
          inject: options.inject,
        },
        {
          provide: Blimu,
          useFactory: (config: BlimuConfig) =>
            new Blimu({
              apiKey: config.apiKey,
              baseURL: config.baseURL || 'https://runtime.blimu.com',
              timeoutMs: config.timeoutMs ?? 30000,
            }),
          inject: [BLIMU_CONFIG],
        },
      ],
      exports: [Reflector, EntitlementGuard, Blimu, BLIMU_CONFIG, JWKService],
    };
  }
}
