/**
 * Interactive prompts for CLI
 */

import { select } from '@inquirer/prompts';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

/**
 * Prompt user to select from a list of options
 * Returns the selected value or null if cancelled
 */
export async function promptSelect(options: {
  title: string;
  choices: SelectOption[];
}): Promise<string | null> {
  try {
    const answer = await select({
      message: options.title,
      choices: options.choices.map((choice) => {
        const base = { name: choice.label, value: choice.value };
        return choice.description != null ? { ...base, description: choice.description } : base;
      }),
    });
    return answer;
  } catch {
    // User cancelled (Ctrl+C)
    return null;
  }
}
