import { ReactNode, useCallback } from 'react';
import { Button, Popup } from 'uilib';
import type { ButtonProps, PopupProps } from 'uilib';
import cn from 'classnames';

type Item = Pick<ButtonProps, 'onClick'> & {
  id: string;
  title: ReactNode;
  className?: string;
};
type Props = Omit<PopupProps, 'content'> & {
  trigger: ReactNode;
  items: Item[];
  onClose?: () => void;
};

import S from './PopupMenu.styl';

export function PopupMenu({ items, onClose, ...props }: Props) {
  if (items.length === 0) return null;

  const { size } = props;

  return (
    <Popup
      {...props}
      content={
        <div className={S.list}>
          {items.map(({ id, title, className, ...rest }) => (
            <Button
              variant="clear"
              size={size}
              {...rest}
              className={cn(S.item, className)}
              key={id}
            >
              {title}
            </Button>
          ))}
        </div>
      }
    />
  );
}
