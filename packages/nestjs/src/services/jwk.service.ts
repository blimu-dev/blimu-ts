import { Inject, Injectable, Logger } from '@nestjs/common';
import { TokenVerifier } from '@blimu/backend';
import { BLIMU_CONFIG, type BlimuConfig } from '../config/blimu.config';

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
   * Verify JWT token issued by Blimu's main auth (environment/session tokens).
   * Uses the configured API key and environment JWKS.
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
   * Verify JWT access token issued by an OAuth2 app (e.g. device code or authorization code flow).
   * Uses the public OAuth JWKS endpoint; no API key required. Pass the OAuth app's client_id.
   */
  async verifyOAuthToken<T = unknown>(token: string, clientId: string): Promise<T> {
    try {
      this.logger.debug(
        `🔍 Verifying OAuth token. Runtime API URL: ${this.config.baseURL}, clientId: ${clientId}`,
      );

      const result = await this.tokenVerifier.verifyToken<T>({
        clientId,
        token,
        runtimeApiUrl: this.config.baseURL,
      });

      this.logger.debug(`✅ OAuth token verified successfully`);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ OAuth token verification failed: ${errorMessage}`);
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
