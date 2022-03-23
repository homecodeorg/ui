import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { config } from 'uilib';

import S from './Paranja.styl';

type Props = {
  children?: ReactNode;
  className?: string;
};

export const Paranja = ({ className, children }: Props) =>
  createPortal(
    <div className={cn(S.root, className)}>{children}</div>,
    document.getElementById(config.appOverlayId)
  );
