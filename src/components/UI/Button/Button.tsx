import { Component } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import cn from 'classnames';

import Spinner from '../Spinner/Spinner';

import S from './Button.styl';
import * as H from './Button.helpers';

export type Props = {
  className?: string;
  children: JSX.Element | JSX.Element[];
  variant: 'clear' | 'default' | 'primary';
  size: 's' | 'm' | 'l';
  type: HTMLButtonElement['type'];
  isLoading: boolean;
  isChecked: boolean;
};

function Button(props: Props) {
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
  const buttonRef = useRef(null);

  function handleMouseUp(e) {
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
    <button className={classes} {...rest} type={type} ref={buttonRef}>
      {children}
      {isLoading && <Spinner className={S.spinner} size={size} />}
    </button>
  );
}

export default Button;
