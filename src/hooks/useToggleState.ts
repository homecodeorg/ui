import { useState, useCallback, useEffect, useRef } from 'react';
import { generateUID } from 'uilib/tools/uid';

export interface UseToggleStateProps {
  id?: string;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}

export interface UseToggleState {
  id: string;
  isActive: boolean;
  isFocused: boolean;
  handlers: {
    onPointerDown: () => void;
    onPointerUp: () => void;
    onFocus: (e: any) => void;
    onBlur: (e: any) => void;
  };
}

export function useToggleState(
  props: UseToggleStateProps = {}
): UseToggleState {
  const id = props.id || generateUID();
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const stopWatching = useRef<() => void>();

  const onPointerUp = useCallback(() => {
    setIsActive(false);
    stopWatching.current?.();
    stopWatching.current = undefined;
  }, []);

  // A touch that turns into a scroll ends with pointercancel, not pointerup,
  // and a press can also be released outside the control. Listen on window
  // for every way the press can end, so the active style never sticks.
  const onPointerDown = useCallback(() => {
    setIsActive(true);
    stopWatching.current?.();
    const events = ['pointerup', 'pointercancel', 'blur'] as const;
    events.forEach(e => window.addEventListener(e, onPointerUp));
    stopWatching.current = () =>
      events.forEach(e => window.removeEventListener(e, onPointerUp));
  }, [onPointerUp]);

  useEffect(() => () => stopWatching.current?.(), []);

  const onFocus = useCallback(
    (e: any) => {
      setIsFocused(true);
      props.onFocus?.(e);
    },
    [props.onFocus]
  );

  const onBlur = useCallback(
    (e: any) => {
      setIsFocused(false);
      props.onBlur?.(e);
    },
    [props.onBlur]
  );

  return {
    id,
    isActive,
    isFocused,
    handlers: {
      onPointerDown,
      onPointerUp,
      onFocus,
      onBlur,
    },
  };
}
