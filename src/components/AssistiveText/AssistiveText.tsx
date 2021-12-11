import { ReactChild, HTMLAttributes } from 'react';
import cn from 'classnames';

import S from './AssistiveText.styl';

type AssistiveTextProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  size?: 's' | 'm' | 'l';
  variant?: 'default' | 'danger';
  children: ReactChild;
  // style?: HTMLAttributes['style'];
};

export function AssistiveText(props: AssistiveTextProps) {
  const {
    className,
    size = 'm',
    variant = 'default',
    children,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        S.root,
        S[`size-${size}`],
        S[`variant-${variant}`],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
