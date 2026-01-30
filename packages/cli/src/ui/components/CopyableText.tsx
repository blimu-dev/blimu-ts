import React, { useState, useEffect } from 'react';
import { Text, useInput } from 'ink';
import clipboardy from 'clipboardy';

interface CopyableTextProps {
  text: string;
  dimmed?: boolean;
  isSubItem?: boolean;
  isFirstSubItem?: boolean;
}

// Check if raw mode is supported (required for useInput)
const isRawModeSupported = () => {
  return process.stdin.isTTY && typeof process.stdin.setRawMode === 'function';
};

// Simple text component without copy functionality
const SimpleText: React.FC<CopyableTextProps> = ({
  text,
  dimmed = false,
  isSubItem = false,
  isFirstSubItem = false,
}) => {
  const prefix = isSubItem ? (isFirstSubItem ? '  ⎿  ' : '     ') : '';

  return (
    <Text>
      {prefix}
      <Text color="blueBright" dimColor={dimmed}>
        {text}
      </Text>
    </Text>
  );
};

// Interactive text component with copy functionality
const InteractiveCopyableText: React.FC<CopyableTextProps> = ({
  text,
  dimmed = false,
  isSubItem = false,
  isFirstSubItem = false,
}) => {
  const [copied, setCopied] = useState(false);
  const prefix = isSubItem ? (isFirstSubItem ? '  ⎿  ' : '     ') : '';

  useInput((input) => {
    if (input === 'c') {
      clipboardy
        .write(text)
        .then(() => {
          setCopied(true);
        })
        .catch(() => {
          // Silently fail if clipboard access fails
        });
    }
  });

  // Reset "Copied!" message after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <Text>
      {prefix}
      <Text color="blueBright" dimColor={dimmed}>
        {text}
      </Text>
      {copied && (
        <Text color="green" dimColor={false}>
          {' '}
          (Copied!)
        </Text>
      )}
    </Text>
  );
};

// Main export - choose appropriate component based on raw mode support
export const CopyableText: React.FC<CopyableTextProps> = (props) => {
  if (isRawModeSupported()) {
    return <InteractiveCopyableText {...props} />;
  }
  return <SimpleText {...props} />;
};
