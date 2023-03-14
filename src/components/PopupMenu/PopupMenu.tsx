import cn from 'classnames';

import { Button } from 'uilib/components/Button/Button';
import { Popup } from 'uilib/components/Popup/Popup';

import S from './PopupMenu.styl';
import * as T from './PopupMenu.types';

export function PopupMenu({ items, onClose, ...props }: T.Props) {
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
