import { createContext } from 'react';

import type { BlimuRuntimeClientWrapper } from '../../client/runtime-client';
import type { AuthState, BlimuConfig } from '../../types';

export interface BlimuContextValue {
  client: BlimuRuntimeClientWrapper;
  config: BlimuConfig;
  state: AuthState;
}

export const BlimuContext = createContext<BlimuContextValue | null>(null);
