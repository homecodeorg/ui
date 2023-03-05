import { createPortal } from 'react-dom';
import cn from 'classnames';
import { config } from 'uilib';

import S from './Paranja.styl';
import * as T from './Paranja.types';

export const Paranja = ({ className, children, isVisible = true }: T.Props) => {
  const classes = cn(S.root, isVisible && S.visible, className);

  return createPortal(
    <div className={classes}>{children}</div>,
    document.getElementById(config.appOverlayId)
  );
};
