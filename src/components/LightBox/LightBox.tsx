import { useCallback, useEffect } from 'react';
import cn from 'classnames';

import { Paranja } from 'uilib/components/Paranja/Paranja';
import { Button } from 'uilib/components/Button/Button';
import { Icon } from 'uilib/components/Icon/Icon';

import S from './LightBox.styl';
import * as T from './LightBox.types';

export function LightBox({ children, isOpen, onClose }: T.Props) {
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
    document.addEventListener('keydown', onKeyDown, true);
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
