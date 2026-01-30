/**
 * Task Runner API - UI rendering using Ink
 */

export type TaskStatus = 'pending' | 'running' | 'success' | 'failed';

export interface Task {
  update(message: string): void;
  succeed(message?: string): void;
  fail(message?: string): void;
}

export interface MessageOptions {
  clearable?: boolean;
  dimmed?: boolean;
}

export interface TaskGroup {
  task(name: string, fn: (task: Task) => Promise<void> | void): Promise<void>;
  info(message: string, options?: MessageOptions): void;
  warn(message: string, options?: MessageOptions): void;
  error(message: string, options?: MessageOptions): void;
  success(message: string, options?: MessageOptions): void;
  copyableText(text: string, options?: MessageOptions): void;
}

export interface TaskRunner {
  group(name: string): TaskGroup;
  info(message: string, options?: MessageOptions): void;
  warn(message: string, options?: MessageOptions): void;
  error(message: string, options?: MessageOptions): void;
  success(message: string, options?: MessageOptions): void;
  wait(): Promise<void>;
}

/**
 * Create a task runner instance using Ink
 */
export async function createTaskRunner(): Promise<TaskRunner> {
  const { InkTaskRunner } = await import('./ink-adapter.js');
  return new InkTaskRunner();
}
