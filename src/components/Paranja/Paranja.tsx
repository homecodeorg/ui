import cn from 'classnames';

import { Portal } from '../Portal/Portal';

import S from './Paranja.styl';
import * as T from './Paranja.types';

export const Paranja = ({
  className,
  children,
  visible = true,
  inline = false,
  blur = false,
}: T.Props) => {
  const classes = cn(S.root, visible && S.visible, blur && S.blur, className);
  const node = <div className={classes}>{children}</div>;

  if (inline) return node;
  return <Portal>{node}</Portal>;
};
