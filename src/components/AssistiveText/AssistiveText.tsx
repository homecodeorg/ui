import cn from 'classnames';

import S from './AssistiveText.styl';
import * as T from './AssistiveText.types';

export function AssistiveText(props: T.Props) {
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
