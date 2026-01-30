/**
 * Ink adapter - TaskRunner implementation using Ink components
 * Provides modern, hierarchical UI for interactive terminals
 */

import React from 'react';
import { render } from 'ink';
import type { TaskRunner, TaskGroup, Task, MessageOptions } from './task-runner.js';
import {
  TaskList,
  type TaskGroupItem,
  type TaskItem,
  type MessageItem,
  type CopyableTextItem,
} from './components/TaskList.js';
import type { MessageType } from './components/Message.js';

let globalIdCounter = 0;

interface InkState {
  groups: TaskGroupItem[];
  globalMessages: MessageItem[];
}

class InkTask implements Task {
  constructor(
    private groupId: string,
    private taskId: string,
    private state: InkState,
    private rerender: () => void
  ) {}

  private updateTask(updates: Partial<Omit<TaskItem, 'type' | 'id'>>): void {
    const group = this.state.groups.find((g) => g.id === this.groupId);
    if (!group) return;

    const task = group.items.find((item) => item.type === 'task' && item.id === this.taskId);
    if (task?.type !== 'task') return;

    Object.assign(task, updates);
    this.rerender();
  }

  update(message: string): void {
    this.updateTask({ message });
  }

  succeed(message?: string): void {
    const updates: Partial<Omit<TaskItem, 'type' | 'id'>> = {
      status: 'success',
    };
    if (message !== undefined) {
      updates.message = message;
    }
    this.updateTask(updates);
  }

  fail(message?: string): void {
    const updates: Partial<Omit<TaskItem, 'type' | 'id'>> = {
      status: 'failed',
    };
    if (message !== undefined) {
      updates.message = message;
    }
    this.updateTask(updates);
  }
}

class InkTaskGroup implements TaskGroup {
  constructor(
    private groupId: string,
    private state: InkState,
    private rerender: () => void
  ) {}

  private getGroup(): TaskGroupItem {
    const group = this.state.groups.find((g) => g.id === this.groupId);
    if (!group) {
      throw new Error(`Group ${this.groupId} not found`);
    }
    return group;
  }

  async task(name: string, fn: (task: Task) => Promise<void> | void): Promise<void> {
    const taskId = `task-${globalIdCounter++}`;
    const group = this.getGroup();

    const taskItem: TaskItem = {
      type: 'task',
      id: taskId,
      name,
      status: 'running',
    };

    group.items.push(taskItem);
    this.rerender();

    const task = new InkTask(this.groupId, taskId, this.state, this.rerender);

    try {
      await fn(task);
      // If the task function didn't explicitly succeed/fail, mark as success
      if (taskItem.status === 'running') {
        task.succeed();
      }
    } catch (error) {
      task.fail();
      throw error;
    }
  }

  private addMessage(messageType: MessageType, message: string, options?: MessageOptions): void {
    const group = this.getGroup();
    const messageItem: MessageItem = {
      type: 'message',
      id: `msg-${globalIdCounter++}`,
      messageType,
      message,
    };

    if (options?.clearable !== undefined) {
      messageItem.clearable = options.clearable;
    }
    if (options?.dimmed !== undefined) {
      messageItem.dimmed = options.dimmed;
    }

    group.items.push(messageItem);
    this.rerender();
  }

  private clearClearableItems(): void {
    const group = this.getGroup();
    group.items = group.items.filter((item) => {
      if (item.type === 'message' && item.clearable) return false;
      if (item.type === 'copyable-text' && item.clearable) return false;
      return true;
    });
    this.rerender();
  }

  info(message: string, options?: MessageOptions): void {
    this.addMessage('info', message, options);
  }

  warn(message: string, options?: MessageOptions): void {
    this.addMessage('warn', message, options);
  }

  error(message: string, options?: MessageOptions): void {
    this.addMessage('error', message, options);
  }

  success(message: string, options?: MessageOptions): void {
    // Clear clearable items before adding success message
    this.clearClearableItems();
    this.addMessage('success', message, options);
  }

  copyableText(text: string, options?: MessageOptions): void {
    const group = this.getGroup();
    const item: CopyableTextItem = {
      type: 'copyable-text',
      id: `copyable-${globalIdCounter++}`,
      text,
    };

    if (options?.clearable !== undefined) {
      item.clearable = options.clearable;
    }
    if (options?.dimmed !== undefined) {
      item.dimmed = options.dimmed;
    }

    group.items.push(item);
    this.rerender();
  }
}

export class InkTaskRunner implements TaskRunner {
  private state: InkState = {
    groups: [],
    globalMessages: [],
  };
  private renderInstance: ReturnType<typeof render> | null = null;
  private isRendering = false;

  private rerender(): void {
    if (this.renderInstance) {
      this.renderInstance.rerender(
        <TaskList groups={this.state.groups} globalMessages={this.state.globalMessages} />
      );
    }
  }

  private ensureRendering(): void {
    if (!this.isRendering) {
      this.renderInstance = render(
        <TaskList groups={this.state.groups} globalMessages={this.state.globalMessages} />
      );
      this.isRendering = true;

      // Ensure cursor is restored on process exit
      const cleanup = () => {
        if (this.renderInstance) {
          this.renderInstance.cleanup();
        }
      };

      process.on('exit', cleanup);
      process.on('SIGINT', () => {
        cleanup();
        process.exit(0);
      });
      process.on('SIGTERM', () => {
        cleanup();
        process.exit(0);
      });
    }
  }

  group(name: string): TaskGroup {
    this.ensureRendering();

    const groupId = `group-${globalIdCounter++}`;
    const groupItem: TaskGroupItem = {
      id: groupId,
      name,
      items: [],
    };

    this.state.groups.push(groupItem);
    this.rerender();

    return new InkTaskGroup(groupId, this.state, this.rerender.bind(this));
  }

  private addGlobalMessage(
    messageType: MessageType,
    message: string,
    options?: MessageOptions
  ): void {
    this.ensureRendering();
    const messageItem: MessageItem = {
      type: 'message',
      id: `msg-${globalIdCounter++}`,
      messageType,
      message,
    };

    if (options?.clearable !== undefined) {
      messageItem.clearable = options.clearable;
    }
    if (options?.dimmed !== undefined) {
      messageItem.dimmed = options.dimmed;
    }

    this.state.globalMessages.push(messageItem);
    this.rerender();
  }

  info(message: string, options?: MessageOptions): void {
    this.addGlobalMessage('info', message, options);
  }

  warn(message: string, options?: MessageOptions): void {
    this.addGlobalMessage('warn', message, options);
  }

  error(message: string, options?: MessageOptions): void {
    this.addGlobalMessage('error', message, options);
  }

  success(message: string, options?: MessageOptions): void {
    this.addGlobalMessage('success', message, options);
  }

  async wait(): Promise<void> {
    if (this.renderInstance) {
      await this.renderInstance.waitUntilExit();
      this.renderInstance.cleanup();
    }
  }
}
