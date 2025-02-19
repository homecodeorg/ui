import { useCallback, useEffect, useRef } from 'react';

type ThrottleOptions = {
  trailing?: boolean;
};

export function useThrottle<T extends any[]>(
  cb: (...args: T) => void,
  limit: number,
  options: ThrottleOptions = { trailing: false },
  deps: any[] = [],
) {
  const lastRun = useRef(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, deps);

  return useCallback(
    (...args: T) => {
      const now = Date.now();
      const execute = () => {
        cb(...args);
        lastRun.current = now;
      };

      const remaining = limit - (now - lastRun.current);

      if (remaining <= 0) {
        clearTimeout(timeoutId.current);
        execute();
      } else if (options.trailing && !timeoutId.current) {
        timeoutId.current = setTimeout(execute, remaining);
      }
    },
    [limit, options.trailing, ...deps],
  );
}
