import React, { useState, useEffect } from 'react';
import { Text } from 'ink';

export type TaskStatus = 'pending' | 'running' | 'success' | 'failed';

interface TaskProps {
  name: string;
  status: TaskStatus;
  message?: string;
  indent?: number;
  isSubItem?: boolean;
  isFirstSubItem?: boolean;
}

const statusSymbols: Record<TaskStatus, string> = {
  pending: '○',
  running: '○',
  success: '●',
  failed: '●',
};

const statusColors: Record<TaskStatus, string> = {
  pending: 'gray',
  running: 'cyan',
  success: 'greenBright',
  failed: 'red',
};

const PulsingDot: React.FC<{ color: string }> = ({ color }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 3);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Cycle through: dim -> normal -> bright
  const dimColor = frame === 0;
  const bright = frame === 2;

  return (
    <Text color={color} dimColor={dimColor} bold={bright}>
      ○
    </Text>
  );
};

export const Task: React.FC<TaskProps> = ({
  name,
  status,
  message,
  indent: _indent = 0,
  isSubItem = false,
  isFirstSubItem = false,
}) => {
  const symbol = statusSymbols[status];
  const color = statusColors[status];
  const displayMessage = message ?? name;

  // For sub-items, use tree connector only for first item
  if (isSubItem) {
    const prefix = isFirstSubItem ? '  ⎿  ' : '     ';
    return (
      <Text>
        <Text>{prefix}</Text>
        <Text dimColor={status === 'success'}>{displayMessage}</Text>
      </Text>
    );
  }

  // Main items show the dot/status
  return (
    <Text>
      {status === 'running' ? (
        <>
          <PulsingDot color={color} />
          <Text> </Text>
        </>
      ) : (
        <Text color={color}>{symbol} </Text>
      )}
      <Text dimColor={status === 'success' || status === 'pending'}>{displayMessage}</Text>
    </Text>
  );
};
