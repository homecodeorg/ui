import { ReactNode, useCallback, useEffect } from 'react';
import cn from 'classnames';

import { Paranja, Button, Icon } from 'uilib';

import S from './LightBox.styl';

type Props = {
  isOpen?: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function LightBox({ children, isOpen, onClose }: Props) {
  const onKeyDown = useCallback(
    e => {
      if (isOpen && onClose && e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  });

  return (
    <Paranja className={cn(S.root, isOpen && S.open)}>
      {children}
      <Button className={S.close} onClick={onClose} variant="clear">
        <Icon type="close" size="l" />
      </Button>
    </Paranja>
  );
}
