import { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';

import { Paranja } from 'uilib/components/Paranja/Paranja';
import { Button } from 'uilib/components/Button/Button';
import { Icon } from 'uilib/components/Icon/Icon';

import S from './LightBox.styl';
import * as T from './LightBox.types';

/** Matches the fade-out in LightBox.styl: the blur stays until it ends. */
const FADE_MS = 200;

export function LightBox({
  children,
  className,
  onClose,
  blur,
  ...props
}: T.Props) {
  const [isOpen, setOpen] = useState(false);
  // A closed light box stays mounted at opacity 0, and an invisible
  // full-screen blur still costs a backdrop pass every frame (a list of cards,
  // each with its own light box, stalled the page). Blur only while it shows.
  const [blurOn, setBlurOn] = useState(false);

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
    if (isOpen) {
      setBlurOn(true);
      return;
    }
    const timer = setTimeout(() => setBlurOn(false), FADE_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen]);

  return (
    <Paranja className={cn(S.root, isOpen && S.open, className)} blur={blur && blurOn}>
      {children}
      <Button className={S.close} onClick={onClose} variant="clear">
        <Icon type="close" size="l" />
      </Button>
    </Paranja>
  );
}
