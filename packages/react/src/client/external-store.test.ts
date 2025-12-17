import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExternalStore } from './external-store';

describe('ExternalStore', () => {
  let store: ExternalStore<{ count: number }>;

  beforeEach(() => {
    store = new ExternalStore({ count: 0 });
  });

  describe('initialization', () => {
    it('should initialize with provided state', () => {
      const initialState = { count: 5 };
      const newStore = new ExternalStore(initialState);
      expect(newStore.getSnapshot()).toEqual(initialState);
    });
  });

  describe('getSnapshot', () => {
    it('should return current state without subscribing', () => {
      expect(store.getSnapshot()).toEqual({ count: 0 });
    });

    it('should return updated state after setState', () => {
      store.setState({ count: 10 });
      expect(store.getSnapshot()).toEqual({ count: 10 });
    });
  });

  describe('subscribe', () => {
    it('should call listener when state changes', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState({ count: 1 });
      expect(listener).toHaveBeenCalledWith({ count: 1 });
    });

    it('should call all listeners when state changes', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);

      store.setState({ count: 2 });

      expect(listener1).toHaveBeenCalledWith({ count: 2 });
      expect(listener2).toHaveBeenCalledWith({ count: 2 });
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should not call listener after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      unsubscribe();
      store.setState({ count: 3 });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should call listener with initial state on first change', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState({ count: 1 });
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith({ count: 1 });
    });
  });

  describe('setState', () => {
    it('should update state with direct value', () => {
      store.setState({ count: 5 });
      expect(store.getSnapshot()).toEqual({ count: 5 });
    });

    it('should update state with function updater', () => {
      store.setState((prev) => ({ count: prev.count + 1 }));
      expect(store.getSnapshot()).toEqual({ count: 1 });
    });

    it('should notify listeners when state is updated directly', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState({ count: 10 });
      expect(listener).toHaveBeenCalledWith({ count: 10 });
    });

    it('should notify listeners when state is updated with function', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState((prev) => ({ count: prev.count * 2 }));
      expect(listener).toHaveBeenCalledWith({ count: 0 });
    });

    it('should handle multiple sequential updates', () => {
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState({ count: 1 });
      store.setState({ count: 2 });
      store.setState({ count: 3 });

      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenNthCalledWith(1, { count: 1 });
      expect(listener).toHaveBeenNthCalledWith(2, { count: 2 });
      expect(listener).toHaveBeenNthCalledWith(3, { count: 3 });
    });

    it('should handle complex state objects', () => {
      interface ComplexState {
        user: { id: string; name: string };
        items: string[];
      }

      const complexStore = new ExternalStore<ComplexState>({
        user: { id: '1', name: 'John' },
        items: ['a', 'b'],
      });

      complexStore.setState({
        user: { id: '2', name: 'Jane' },
        items: ['c'],
      });

      expect(complexStore.getSnapshot()).toEqual({
        user: { id: '2', name: 'Jane' },
        items: ['c'],
      });
    });
  });
});
