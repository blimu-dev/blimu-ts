import { createContext } from 'react';

import type { BlimuRuntimeClientWrapper } from '../../client/runtime-client';
import type { AuthState, BlimuConfig } from '../../types';
import type { Theme } from '../theme/theme.context';

export interface AppearanceConfig {
  /**
   * Base theme (light, dark, or system)
   * @default "system"
   */
  baseTheme?: Theme;
  /**
   * CSS variable overrides
   */
  variables?: Record<string, string>;
  /**
   * Whether to inherit theme from parent app (e.g., next-themes)
   * @default true
   */
  inheritTheme?: boolean;
}

export interface BlimuContextValue {
  client: BlimuRuntimeClientWrapper;
  config: BlimuConfig;
  state: AuthState;
  appearance?: AppearanceConfig;
}

export const BlimuContext = createContext<BlimuContextValue | null>(null);
