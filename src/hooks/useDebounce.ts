import { useCallback } from 'react';

import debounce from '../tools/debounce';

export function useDebounce(fn: (...args: any[]) => void, delay: number) {
  return useCallback(debounce(fn, delay), [fn, delay]);
}
