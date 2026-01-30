import React from 'react';
import { Box } from 'ink';
import { Task, type TaskStatus } from './Task.js';
import { Message, type MessageType } from './Message.js';
import { CopyableText } from './CopyableText.js';

export interface TaskItem {
  type: 'task';
  id: string;
  name: string;
  status: TaskStatus;
  message?: string;
}

export interface MessageItem {
  type: 'message';
  id: string;
  messageType: MessageType;
  message: string;
  clearable?: boolean;
  dimmed?: boolean;
}

export interface CopyableTextItem {
  type: 'copyable-text';
  id: string;
  text: string;
  clearable?: boolean;
  dimmed?: boolean;
}

export type GroupItem = TaskItem | MessageItem | CopyableTextItem;

export interface TaskGroupItem {
  id: string;
  name: string;
  items: GroupItem[];
}

interface TaskListProps {
  groups: TaskGroupItem[];
  globalMessages: MessageItem[];
}

const getGroupStatus = (items: GroupItem[]): TaskStatus => {
  const tasks = items.filter((item): item is TaskItem => item.type === 'task');
  const messages = items.filter((item): item is MessageItem => item.type === 'message');

  // Check for success/error messages first (takes precedence)
  const hasErrorMessage = messages.some((msg) => msg.messageType === 'error');
  const hasSuccessMessage = messages.some((msg) => msg.messageType === 'success');

  if (hasErrorMessage) {
    return 'failed';
  }

  if (hasSuccessMessage) {
    return 'success';
  }

  // If there are tasks, derive status from them
  if (tasks.length > 0) {
    // If any task failed, group is failed
    if (tasks.some((task) => task.status === 'failed')) {
      return 'failed';
    }

    // If all tasks succeeded, group is successful
    if (tasks.every((task) => task.status === 'success')) {
      return 'success';
    }
  }

  // Otherwise, group is still running
  return 'running';
};

export const TaskList: React.FC<TaskListProps> = ({ groups, globalMessages }) => {
  return (
    <Box flexDirection="column">
      {groups.map((group) => {
        const groupStatus = getGroupStatus(group.items);

        return (
          <Box key={group.id} flexDirection="column">
            <Task name={group.name} status={groupStatus} indent={0} isSubItem={false} />
            {group.items.map((item, index) => {
              if (item.type === 'task') {
                return (
                  <Task
                    key={item.id}
                    name={item.name}
                    status={item.status}
                    {...(item.message !== undefined && { message: item.message })}
                    indent={1}
                    isSubItem={true}
                    isFirstSubItem={index === 0}
                  />
                );
              } else if (item.type === 'copyable-text') {
                return (
                  <CopyableText
                    key={item.id}
                    text={item.text}
                    isSubItem={true}
                    isFirstSubItem={index === 0}
                    {...(item.dimmed !== undefined && { dimmed: item.dimmed })}
                  />
                );
              } else {
                return (
                  <Message
                    key={item.id}
                    type={item.messageType}
                    message={item.message}
                    isSubItem={true}
                    isFirstSubItem={index === 0}
                    {...(item.dimmed !== undefined && { dimmed: item.dimmed })}
                  />
                );
              }
            })}
          </Box>
        );
      })}
      {globalMessages.map((msg) => (
        <Message key={msg.id} type={msg.messageType} message={msg.message} indent={0} />
      ))}
    </Box>
  );
};
