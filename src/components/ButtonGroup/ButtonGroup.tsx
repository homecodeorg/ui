import cn from 'classnames';

import * as T from './ButtonGroup.types';
import S from './ButtonGroup.styl';

export function ButtonGroup(props: T.Props) {
  const { children, className, ...rest } = props;

  return (
    <div className={cn(S.root, className)} {...rest}>
      {children}
    </div>
  );
}
