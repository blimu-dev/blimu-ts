import { useContext } from 'react';

import { BlimuContext } from './blimu.context';

/**
 * Hook for accessing Blimu client and configuration
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, config } = useBlimu();
 *
 *   // Use client to make API calls
 *   const handleAction = async () => {
 *     const result = await client.getClient().someMethod();
 *   };
 *
 *   return <div>Publishable Key: {config.publishableKey}</div>;
 * }
 * ```
 */
export function useBlimu() {
  const context = useContext(BlimuContext);
  if (!context) {
    throw new Error('useBlimu must be used within a BlimuProvider');
  }
  return context;
}
