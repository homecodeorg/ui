import { useEffect, useRef, useCallback, useState } from 'react';
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
    round,
    onMouseUp,
    children,
    type = 'button',
    variant = 'default',
    size = 'm',
    prefixElem,
    postfixElem,
    onRef,
    ...rest
  } = props;
  // An icon-only (square) button shows no spinner: its icon pulses instead, and a tooltip
  // around it can say what is happening.
  const iconBusy = loading && square;
  const { disabled } = props;
  const classes = cn(
    S.root,
    S[`size-${size}`],
    S[`variant-${variant}`],
    loading && (iconBusy ? S.iconBusy : S.loading),
    checked && S.checked,
    square && S.square,
    round && S.round,
    className
  );

  const [buttonElem, setButtonElem] = useState<HTMLButtonElement>(null);

  const onRefHandler = useCallback(elem => {
    if (onRef) onRef(elem);
    setButtonElem(elem);
  }, []);

  // @ts-ignore
  rest.onMouseUp = useCallback(
    e => {
      if (onMouseUp) onMouseUp(e);
      H.focusOnClick(buttonElem);
    },
    [onMouseUp, buttonElem]
  );

  if (disabled) rest.tabIndex = -1;
  if (iconBusy) {
    delete rest.onClick;
    rest['aria-busy'] = true;
    rest['aria-disabled'] = true;
  }

  useEffect(() => {
    const activeElement = document.activeElement as HTMLButtonElement;

    if (!disabled || !activeElement) return;
    if (buttonElem && buttonElem === activeElement) activeElement?.blur(); // eslint-disable-line
  }, [disabled]);

  return (
    // @ts-ignore
    <button className={classes} {...rest} type={type} ref={onRefHandler}>
      {prefixElem && <div className={S.prefix}>{prefixElem}</div>}
      {typeof children === 'string' ? <span>{children}</span> : children}
      {postfixElem && <div className={S.postfix}>{postfixElem}</div>}
      {loading && !iconBusy && <Spinner className={cn(S.spinner, S.postfix)} size={size} />}
    </button>
  );
}
