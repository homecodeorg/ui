import { Component, HTMLProps } from 'preact';
import cn from 'classnames';

import Spinner from '../Spinner/Spinner';

import S from './Button.styl';

export type Props = HTMLProps<HTMLButtonElement> & {
  className?: string;
  children: JSX.Element | JSX.Element[];
  variant: 'clear' | 'default' | 'primary';
  size: 's' | 'm' | 'l';
  isLoading: boolean;
  isChecked: boolean;
};

function Button(props: Props) {
  const {
    className,
    isLoading,
    isChecked,
    children,
    type = 'button',
    variant = 'default',
    size = 's',
    ...rest
  } = props;

  const classes = cn(
    S.root,
    S[`size-${size}`],
    S[`variant-${variant}`],
    isLoading && S.isLoading,
    isChecked && S.isChecked,
    className
  );

  return (
    <button className={classes} {...rest} type={type}>
      {children}
      {isLoading && <Spinner className={S.spinner} size={size} />}
    </button>
  );
}

export default Button;
