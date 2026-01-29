/**
 * Hardcoded client IDs for Blimu internal environments
 * These are the OAuth2 app client IDs for different deployment environments
 */

export type BlimuInternalEnvironment = 'local-dev' | 'local-prod' | 'cloud-dev' | 'cloud-prod';

/**
 * Client ID mapping for each environment
 * TODO: Replace with actual client IDs once OAuth apps are created
 */
export const CLIENT_IDS: Record<BlimuInternalEnvironment, string> = {
  'local-dev': '9MhKB71lI9jF5p5OSfykG4juDo5hiGYm',
  'local-prod': 'client_id_for_local_prod',
  'cloud-dev': 'client_id_for_cloud_dev',
  'cloud-prod': 'client_id_for_cloud_prod',
};

/**
 * Get client ID for an environment
 * @param environment - The internal environment
 * @returns Client ID string
 */
export function getClientId(environment: BlimuInternalEnvironment): string {
  const clientId = CLIENT_IDS[environment];
  if (!clientId || clientId.startsWith('client_id_for_')) {
    throw new Error(
      `Client ID not configured for environment: ${environment}. Please update CLIENT_IDS in client-ids.ts`
    );
  }
  return clientId;
}

/**
 * Default environment
 */
export const DEFAULT_ENVIRONMENT: BlimuInternalEnvironment = 'cloud-prod';
