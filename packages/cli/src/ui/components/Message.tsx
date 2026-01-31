import React from 'react';
import { Text } from 'ink';

export type MessageType = 'info' | 'warn' | 'error' | 'success';

interface MessageProps {
  type: MessageType;
  message: string;
  indent?: number;
  isSubItem?: boolean;
  isFirstSubItem?: boolean;
  dimmed?: boolean;
}

export const Message: React.FC<MessageProps> = ({
  type,
  message,
  indent: _indent = 0,
  isSubItem = false,
  isFirstSubItem = false,
  dimmed = false,
}) => {
  const prefix = isSubItem ? (isFirstSubItem ? '  ⎿  ' : '     ') : '';

  const colorMap: Record<MessageType, string> = {
    info: 'blueBright',
    warn: 'yellow',
    error: 'redBright',
    success: 'greenBright',
  };

  return (
    <Text>
      {prefix}
      <Text color={colorMap[type]} dimColor={dimmed}>
        {message}
      </Text>
    </Text>
  );
};
