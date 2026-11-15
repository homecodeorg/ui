import { useState, useCallback } from 'react';
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

  const onPointerDown = useCallback(() => {
    setIsActive(true);
  }, []);

  const onPointerUp = useCallback(() => {
    setIsActive(false);
  }, []);

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
