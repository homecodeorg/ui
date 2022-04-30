import {
  ButtonHTMLAttributes,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import cn from 'classnames';

import { Spinner } from '../Spinner/Spinner';

import S from './Button.styl';
import * as H from './Button.helpers';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: ReactNode;
  variant?: 'clear' | 'default' | 'primary';
  size?: 's' | 'm' | 'l';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  checked?: boolean;
  square?: boolean;
  tabIndex?: number;
  prefixElem?: JSX.Element;
  postfixElem?: JSX.Element;
  style?: Partial<CSSStyleDeclaration>;
};

export type ButtonProps = Props;

export function Button(props: Props) {
  const {
    className,
    isLoading,
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
    isLoading && S.isLoading,
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
      {isLoading && (
        <Spinner className={cn(S.spinner, S.postfix)} size={size} />
      )}
    </button>
  );
}
