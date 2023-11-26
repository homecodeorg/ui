import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';

import { Paranja } from 'uilib/components/Paranja/Paranja';
import { Button } from 'uilib/components/Button/Button';
import { Icon } from 'uilib/components/Icon/Icon';

import S from './LightBox.styl';
import * as T from './LightBox.types';

export function LightBox({
  children,
  className,
  onClose,
  blur,
  ...props
}: T.Props) {
  const [isOpen, setOpen] = useState(false);

  const onKeyDown = useCallback(
    e => {
      if (isOpen && e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        onClose?.();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    setOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen]);

  return (
    <Paranja className={cn(S.root, isOpen && S.open, className)} blur={blur}>
      {children}
      <Button className={S.close} onClick={onClose} variant="clear">
        <Icon type="close" size="l" />
      </Button>
    </Paranja>
  );
}
