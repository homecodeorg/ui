import { ReactNode } from 'react';
import { Button, Popup } from 'uilib';
import type { ButtonProps } from 'uilib';

type Item = Pick<ButtonProps, 'onClick'> & {
  id: string;
  title: ReactNode;
};
type Props = {
  trigger: ReactNode;
  items: Item[];
};

import S from './PopupMenu.styl';

export function PopupMenu({ trigger, items, ...props }: Props) {
  if (items.list === 0) return null;

  return (
    <Popup
      {...props}
      direction="bottom-left"
      trigger={trigger}
      content={
        <div className={S.list}>
          {items.map(({ id, title, ...rest }) => (
            <Button variant="clear" {...rest} key={id}>
              {title}
            </Button>
          ))}
        </div>
      }
    />
  );
}
