import { createPortal } from 'react-dom';
import cn from 'classnames';

import { config } from 'uilib/tools/config';

import S from './Paranja.styl';
import * as T from './Paranja.types';

export const Paranja = ({
  className,
  children,
  visible = true,
  inline = false,
}: T.Props) => {
  const classes = cn(S.root, visible && S.visible, className);
  const node = <div className={classes}>{children}</div>;

  if (inline) return node;
  return createPortal(node, document.getElementById(config.appOverlayId));
};
