import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

interface SelectListProps {
  options: SelectOption[];
  onSelect: (value: string) => void;
  onCancel?: () => void;
  title?: string;
}

export const SelectList: React.FC<SelectListProps> = ({ options, onSelect, onCancel, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (key.return) {
      const selected = options[selectedIndex];
      if (selected) {
        onSelect(selected.value);
      }
    } else if (key.escape && onCancel) {
      onCancel();
    }
  });

  return (
    <Box flexDirection="column">
      {title && (
        <Box marginBottom={1}>
          <Text bold color="cyan">
            {title}
          </Text>
        </Box>
      )}
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Box key={option.value} flexDirection="column">
            <Box>
              <Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
                {isSelected ? '❯ ' : '  '}
                {option.label}
              </Text>
            </Box>
            {option.description && isSelected && (
              <Box paddingLeft={2}>
                <Text dimColor>{option.description}</Text>
              </Box>
            )}
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text dimColor>Use arrow keys to navigate, Enter to select</Text>
      </Box>
    </Box>
  );
};
