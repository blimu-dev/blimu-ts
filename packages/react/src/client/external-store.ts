export class ExternalStore<T> {
  private state: T;
  private listeners: Set<(state: T) => void> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  /**
   * Subscribe to state changes
   * Returns an unsubscribe function
   */
  subscribe = (listener: (state: T) => void): (() => void) => {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Update state and notify all listeners
   * Accepts either a new state value or a function updater
   */
  setState = (state: T | ((state: T) => T)) => {
    if (typeof state === 'function') {
      this.state = (state as (prev: T) => T)(this.state);
    } else {
      this.state = state;
    }
    // Notify all listeners
    this.listeners.forEach((listener) => listener(this.state));
  };

  /**
   * Get current state without subscribing
   */
  getSnapshot = (): T => {
    return this.state;
  };
}
