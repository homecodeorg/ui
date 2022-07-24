import { createPortal } from 'react-dom';
import cn from 'classnames';
import { config } from 'uilib';

import S from './Paranja.styl';
import * as T from './Paranja.types';

export const Paranja = ({ className, children }: T.Props) =>
  createPortal(
    <div className={cn(S.root, className)}>{children}</div>,
    document.getElementById(config.appOverlayId)
  );
