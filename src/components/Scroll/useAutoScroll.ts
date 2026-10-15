import { useCallback, useEffect, useRef } from 'react';

// Distance (px) from the bottom still treated as "at the bottom".
export const AUTO_SCROLL_BOTTOM_EPS = 8;
// Growth burst is reset after this long (ms) without scrollHeight changes.
export const AUTO_SCROLL_TIMEOUT = 1000;
// After a user input, scroll events within this window (ms) are attributed to the user.
const USER_INPUT_WINDOW = 200;
// Shortest window (s) used to estimate the growth rate, so the first frames of a burst don't spike.
const MIN_RATE_WINDOW = 0.12;
// How fast the remaining distance is caught up (1/s).
const CATCH_UP = 3;
// While content keeps growing, stay this far (in seconds of growth) behind the
// bottom, so the scroll keeps a steady pace instead of catch-up-and-stop pulses.
const LAG_TIME = 0.3;
// Time constant (s) of the growth rate easing.
const RATE_TAU = 0.4;
// Time constant (s) of each of the two speed easing stages.
// Two stages give ease-in-out speed changes instead of a jerky ease-out.
const SPEED_TAU = 0.1;
// Deceleration (px/s²) used to brake before reaching the bottom.
const BRAKE = 700;
const MAX_SPEED = 6000;
const MAX_FRAME_DT = 1 / 30;

const USER_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
]);

const getMaxTop = (el: HTMLElement) => el.scrollHeight - el.clientHeight;

export const isAtBottom = (el: HTMLElement, eps = AUTO_SCROLL_BOTTOM_EPS) =>
  getMaxTop(el) - el.scrollTop <= eps;

type Params = {
  enabled: boolean;
  innerRef: React.RefObject<HTMLDivElement>;
  // True while the custom scrollbar thumb is dragged.
  isDraggingRef: React.MutableRefObject<boolean>;
};

/**
 * Keeps the scroll pinned to the bottom while content grows.
 * Follows only when the user is at the bottom; scrolling away pauses it,
 * returning to the bottom resumes it.
 * Speed is driven by the growth delta of the current burst and the remaining
 * distance, and is eased every frame so speed changes stay smooth.
 */
export function useAutoScroll({ enabled, innerRef, isDraggingRef }: Params) {
  const isFollowingRef = useRef(true);
  const userActiveUntilRef = useRef(0);
  const isTouchingRef = useRef(false);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const posRef = useRef(0);
  const speedRef = useRef(0);
  const rateRef = useRef(0);
  const targetSpeedRef = useRef(0);
  const lastHeightRef = useRef(0);
  const burstRef = useRef<{
    startHeight: number;
    startTime: number;
    lastTime: number;
  } | null>(null);

  const isUserActive = (now: number) =>
    isTouchingRef.current ||
    isDraggingRef.current ||
    now < userActiveUntilRef.current;

  const resetMotion = (el: HTMLElement) => {
    speedRef.current = 0;
    rateRef.current = 0;
    targetSpeedRef.current = 0;
    burstRef.current = null;
    posRef.current = el.scrollTop;
    lastHeightRef.current = el.scrollHeight;
  };

  const stop = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const frame = (now: number) => {
    rafRef.current = null;
    const el = innerRef.current;
    if (!el || !enabled || !isFollowingRef.current) return;

    const dt = Math.min((now - lastTimeRef.current) / 1000, MAX_FRAME_DT);
    lastTimeRef.current = now;

    // Track growth bursts
    const height = el.scrollHeight;
    if (height !== lastHeightRef.current) {
      if (height > lastHeightRef.current && !burstRef.current) {
        burstRef.current = {
          startHeight: lastHeightRef.current,
          startTime: now,
          lastTime: now,
        };
      }
      if (burstRef.current) burstRef.current.lastTime = now;
      lastHeightRef.current = height;
    }

    const burst = burstRef.current;
    if (burst && now - burst.lastTime > AUTO_SCROLL_TIMEOUT) {
      burstRef.current = null;
    }

    // Something else moved the scroll (user, layout) – take it as the new origin
    if (Math.abs(el.scrollTop - posRef.current) > 2) posRef.current = el.scrollTop;

    const maxTop = getMaxTop(el);
    if (posRef.current > maxTop) posRef.current = Math.max(0, maxTop);
    const gap = maxTop - posRef.current;

    if (isUserActive(now)) {
      speedRef.current = 0;
      targetSpeedRef.current = 0;
      schedule();
      return;
    }

    let rate = 0;
    if (burstRef.current) {
      const { startHeight, startTime } = burstRef.current;
      const elapsed = Math.max((now - startTime) / 1000, MIN_RATE_WINDOW);
      rate = Math.max(0, height - startHeight) / elapsed;
    }

    const k = 1 - Math.exp(-dt / SPEED_TAU);
    // Ease the rate too, so burst start/reset never makes the speed jump
    rateRef.current += (rate - rateRef.current) * (1 - Math.exp(-dt / RATE_TAU));
    rate = rateRef.current;

    // Brake with constant deceleration instead of hitting the bottom at full speed
    const brakeCap = Math.sqrt(2 * BRAKE * Math.max(gap, 0));
    const lag = burstRef.current ? rate * LAG_TIME : 0;
    const target = Math.min(
      Math.max(0, rate + (gap - lag) * CATCH_UP),
      MAX_SPEED
    );

    const targetSpeed =
      targetSpeedRef.current + (target - targetSpeedRef.current) * k;
    let speed = speedRef.current + (targetSpeed - speedRef.current) * k;

    targetSpeedRef.current = Math.min(targetSpeed, brakeCap);
    speed = Math.max(0, Math.min(speed, brakeCap));
    speedRef.current = speed;

    if (gap > 0) {
      posRef.current += Math.min(speed * dt, gap);
      el.scrollTop = posRef.current;
    }

    const isIdle = !burstRef.current && maxTop - posRef.current < 0.5;
    if (isIdle) {
      speedRef.current = 0;
      rateRef.current = 0;
      targetSpeedRef.current = 0;
      return;
    }

    schedule();
  };

  const schedule = () => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(frame);
  };

  const wake = useCallback(() => {
    const el = innerRef.current;
    if (!enabled || !el || !isFollowingRef.current) return;
    if (rafRef.current !== null) return;

    lastTimeRef.current = performance.now();
    if (Math.abs(el.scrollTop - posRef.current) > 2) posRef.current = el.scrollTop;
    schedule();
  }, [enabled]);

  const setFollowing = (value: boolean) => {
    const el = innerRef.current;
    if (isFollowingRef.current === value) return;

    isFollowingRef.current = value;
    if (!el) return;

    resetMotion(el);
    if (value) wake();
    else stop();
  };

  const markUserInput = () => {
    userActiveUntilRef.current = performance.now() + USER_INPUT_WINDOW;
  };

  // Called by Scroll on every scroll event of the inner element
  const onScroll = useCallback(() => {
    const el = innerRef.current;
    if (!enabled || !el) return;
    if (!isUserActive(performance.now())) return;

    // keep attributing momentum scroll to the user
    markUserInput();
    setFollowing(isAtBottom(el));
  }, [enabled]);

  const scrollToBottom = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;

    userActiveUntilRef.current = 0;
    if (!isFollowingRef.current) {
      isFollowingRef.current = true;
      resetMotion(el);
    }
    wake();
  }, [wake]);

  // Thumb drag released – decide by position
  const onDragEnd = useCallback(() => {
    const el = innerRef.current;
    if (!enabled || !el) return;
    setFollowing(isAtBottom(el));
  }, [enabled]);

  // User input listeners
  useEffect(() => {
    const el = innerRef.current;
    if (!enabled || !el) return;

    const onWheel = (e: WheelEvent) => {
      markUserInput();
      if (e.deltaY < 0) setFollowing(false);
    };
    const onTouchStart = () => {
      isTouchingRef.current = true;
      markUserInput();
    };
    const onTouchMove = () => {
      markUserInput();
      if (!isAtBottom(el)) setFollowing(false);
    };
    const onTouchEnd = () => {
      isTouchingRef.current = false;
      markUserInput();
      setFollowing(isAtBottom(el));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!USER_KEYS.has(e.key)) return;
      markUserInput();
      if (['ArrowUp', 'PageUp', 'Home'].includes(e.key)) setFollowing(false);
    };

    const passive = { passive: true } as const;
    el.addEventListener('wheel', onWheel, passive);
    el.addEventListener('touchstart', onTouchStart, passive);
    el.addEventListener('touchmove', onTouchMove, passive);
    el.addEventListener('touchend', onTouchEnd, passive);
    el.addEventListener('touchcancel', onTouchEnd, passive);
    el.addEventListener('keydown', onKeyDown);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
      el.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled]);

  // Content growth observers
  useEffect(() => {
    const el = innerRef.current;
    if (!enabled || !el) return;

    // Start pinned to the bottom
    isFollowingRef.current = true;
    el.scrollTop = getMaxTop(el);
    resetMotion(el);

    const resizeObserver = new ResizeObserver(() => wake());
    const observeChildren = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(el);
      Array.from(el.children).forEach(child => resizeObserver.observe(child));
    };
    const mutationObserver = new MutationObserver(mutations => {
      if (mutations.some(m => m.type === 'childList' && m.target === el)) {
        observeChildren();
      }
      wake();
    });

    observeChildren();
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      stop();
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [enabled, wake]);

  return { onScroll, onDragEnd, scrollToBottom };
}
