import { ReactChild } from 'react';
import { useEffect, useRef } from 'preact/hooks';
import cn from 'classnames';

import { Spinner } from '../Spinner/Spinner';

import S from './Button.styl';
import * as H from './Button.helpers';

type Props = {
  className?: string;
  children: ReactChild;
  variant?: 'clear' | 'default' | 'primary';
  size?: 's' | 'm' | 'l';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  isChecked?: boolean;
  isSquare?: boolean;
  onMouseUp?: (e: MouseEvent) => void;
  onClick?: (e: MouseEvent) => void;
  tabIndex?: number;
  style?: Partial<CSSStyleDeclaration>;
};

export type ButtonProps = Props;

export function Button(props: Props) {
  const {
    className,
    isLoading,
    isChecked,
    isSquare,
    onMouseUp,
    children,
    type = 'button',
    variant = 'default',
    size = 's',
    ...rest
  } = props;
  const { disabled } = props;
  const classes = cn(
    S.root,
    S[`size-${size}`],
    S[`variant-${variant}`],
    isLoading && S.isLoading,
    isChecked && S.isChecked,
    isSquare && S.isSquare,
    className
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleMouseUp(e: MouseEvent) {
    if (onMouseUp) onMouseUp(e);
    H.focusOnClick(buttonRef.current);
  }

  // @ts-ignore
  rest.onMouseUp = handleMouseUp;
  if (disabled) rest.tabIndex = -1;

  useEffect(() => {
    const activeElement = document.activeElement as HTMLButtonElement;

    if (!disabled || !activeElement) return;
    if (buttonRef?.current === activeElement) activeElement?.blur(); // eslint-disable-line
  }, [disabled]);

  return (
    // @ts-ignore
    <button className={classes} {...rest} type={type} ref={buttonRef}>
      {children}
      {isLoading && <Spinner className={S.spinner} size={size} />}
    </button>
  );
}
