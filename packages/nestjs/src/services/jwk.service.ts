import { Inject, Injectable, Logger } from '@nestjs/common';
import { TokenVerifier } from '@blimu/backend';
import { BLIMU_CONFIG, BlimuConfig } from '../config/blimu.config';

@Injectable()
export class JWKService {
  private readonly logger = new Logger(JWKService.name);
  private readonly tokenVerifier: TokenVerifier;

  constructor(@Inject(BLIMU_CONFIG) private readonly config: BlimuConfig) {
    this.tokenVerifier = new TokenVerifier({
      runtimeApiUrl: this.config.baseURL,
    });
  }

  /**
   * Verify JWT token using JWKs from runtime-api
   */
  async verifyToken<T = unknown>(token: string): Promise<T> {
    try {
      this.logger.debug(
        `🔍 Verifying token. Runtime API URL: ${this.config.baseURL}, API Key prefix: ${this.config.apiKey?.substring(0, 10)}...`,
      );

      const result = await this.tokenVerifier.verifyToken<T>({
        secretKey: this.config.apiKey,
        token,
        runtimeApiUrl: this.config.baseURL,
      });

      this.logger.debug(`✅ Token verified successfully`);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Token verification failed: ${errorMessage}`);
      if (error instanceof Error && error.stack) {
        this.logger.error(`Stack trace: ${error.stack}`);
      }
      throw error;
    }
  }

  /**
   * Clear cache (useful for testing or key rotation)
   */
  clearCache(): void {
    this.tokenVerifier.clearCache(this.config.apiKey);
    this.logger.debug('JWK cache cleared');
  }
}
