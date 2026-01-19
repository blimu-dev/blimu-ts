import { createContext } from 'react';

import type { BlimuRuntimeClientWrapper } from '../../client/runtime-client';
import type { AuthState, BlimuConfig } from '../../types';
import type { Theme } from '../theme/theme.context';

export interface AppearanceConfig {
  /**
   * Base theme (light, dark, or system)
   * @default "system"
   */
  baseTheme?: Theme | undefined;
  /**
   * CSS variable overrides
   */
  variables?: Record<string, string> | undefined;
  /**
   * Whether to inherit theme from parent app (e.g., next-themes)
   * @default true
   */
  inheritTheme?: boolean | undefined;
}

export interface BlimuContextValue {
  client: BlimuRuntimeClientWrapper;
  config: BlimuConfig;
  state: AuthState;
  appearance?: AppearanceConfig | undefined;
}

export const BlimuContext = createContext<BlimuContextValue | null>(null);
