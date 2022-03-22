import { createPortal } from 'react-dom';
import cn from 'classnames';
import { config } from 'uilib';

import S from './Paranja.styl';

export const Paranja = ({ className, children }) =>
  createPortal(
    <div className={cn(S.root, className)}>{children}</div>,
    document.getElementById(config.appOverlayId)
  );
