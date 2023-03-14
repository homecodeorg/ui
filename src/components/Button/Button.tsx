import { useEffect, useRef, useCallback } from 'react';
import cn from 'classnames';

import { Spinner } from 'uilib/components/Spinner/Spinner';

import S from './Button.styl';
import * as H from './Button.helpers';
import * as T from './Button.types';

export type ButtonProps = T.Props;

export function Button(props: T.Props) {
  const {
    className,
    loading,
    checked,
    square,
    onMouseUp,
    children,
    type = 'button',
    variant = 'default',
    size = 'm',
    prefixElem,
    postfixElem,
    ...rest
  } = props;
  const { disabled } = props;
  const classes = cn(
    S.root,
    S[`size-${size}`],
    S[`variant-${variant}`],
    loading && S.loading,
    checked && S.checked,
    square && S.square,
    className
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  // @ts-ignore
  rest.onMouseUp = useCallback(
    e => {
      if (onMouseUp) onMouseUp(e);
      H.focusOnClick(buttonRef.current);
    },
    [onMouseUp, buttonRef]
  );

  if (disabled) rest.tabIndex = -1;

  useEffect(() => {
    const activeElement = document.activeElement as HTMLButtonElement;

    if (!disabled || !activeElement) return;
    if (buttonRef?.current === activeElement) activeElement?.blur(); // eslint-disable-line
  }, [disabled]);

  return (
    // @ts-ignore
    <button className={classes} {...rest} type={type} ref={buttonRef}>
      {prefixElem && <div className={S.prefix}>{prefixElem}</div>}
      {typeof children === 'string' ? <span>{children}</span> : children}
      {postfixElem && <div className={S.postfix}>{postfixElem}</div>}
      {loading && <Spinner className={cn(S.spinner, S.postfix)} size={size} />}
    </button>
  );
}
