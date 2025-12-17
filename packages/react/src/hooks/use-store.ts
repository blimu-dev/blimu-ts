import { useSyncExternalStore } from 'react';

import type { ExternalStore } from '../client/external-store';

/**
 * Hook to subscribe to an ExternalStore and get its current state
 * Uses React's useSyncExternalStore for optimal performance and SSR support
 *
 * @example
 * ```tsx
 * const store = new ExternalStore({ count: 0 });
 *
 * function Counter() {
 *   const state = useStore(store);
 *   return (
 *     <div>
 *       <p>Count: {state.count}</p>
 *       <button onClick={() => store.setState({ count: state.count + 1 })}>
 *         Increment
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useStore<T>(store: ExternalStore<T>): T {
  return useSyncExternalStore(
    // subscribe function - returns unsubscribe
    // useSyncExternalStore expects a callback that just notifies of changes
    // Our store passes state to listeners, so we wrap it to ignore the state
    store.subscribe,
    // getSnapshot function - returns current state
    store.getSnapshot,
    // getServerSnapshot (optional) - for SSR compatibility
    // Returns initial state for server-side rendering
    store.getSnapshot,
  );
}
