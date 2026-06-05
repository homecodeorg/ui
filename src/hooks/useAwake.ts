import { useEffect, useRef } from 'react';

type WakeLockSentinelLike = {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: 'release', listener: () => void) => void;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>;
  };
};

function getWakeLockNavigator(): NavigatorWithWakeLock | null {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
    return null;
  }

  return navigator as NavigatorWithWakeLock;
}

export function useAwake(isActive: boolean): void {
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  const sentinelRef = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    const wakeLockNavigator = getWakeLockNavigator();
    if (!wakeLockNavigator?.wakeLock) return;

    const release = async () => {
      const sentinel = sentinelRef.current;
      sentinelRef.current = null;
      if (!sentinel || sentinel.released) return;

      try {
        await sentinel.release();
      } catch {
        // already released or unsupported
      }
    };

    const request = async () => {
      if (!isActiveRef.current || document.visibilityState !== 'visible') return;

      await release();

      try {
        const sentinel = await wakeLockNavigator.wakeLock.request('screen');
        sentinelRef.current = sentinel;
        sentinel.addEventListener('release', () => {
          if (sentinelRef.current === sentinel) {
            sentinelRef.current = null;
          }
        });
      } catch {
        // NotAllowedError, etc.
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void request();
      }
    };

    if (isActive) {
      void request();
    } else {
      void release();
    }

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void release();
    };
  }, [isActive]);
}
