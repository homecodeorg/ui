import { createContext, useContext } from 'react';

import type { RadioGroupContextValue } from './RadioGroup.types';

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null
);

export function useRadioGroup(): RadioGroupContextValue | null {
  return useContext(RadioGroupContext);
}
