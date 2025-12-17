import { useBlimu } from '../providers/blimu/blimu.hook';

/**
 * Hook for accessing the Blimu API client instance
 *
 * Returns the underlying Blimu client that can be used to make direct API calls
 * to the Blimu runtime API. The client is pre-configured with authentication
 * headers and the publishable key.
 *
 * @returns The Blimu API client instance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const client = useClient();
 *
 *
 *   const handleListEntitlements = async () => {
 *     const result = await client.entitlements.listForTenant({
 *       tenantResourceId: 'org_123',
 *     });
 *   };
 *
 *   return <button onClick={handleListEntitlements}>List Entitlements</button>;
 * }
 * ```
 */
export function useClient() {
  const { client } = useBlimu();
  const blimuClient = client.getClient();
  return blimuClient;
}
