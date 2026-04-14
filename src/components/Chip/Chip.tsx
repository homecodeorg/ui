import cn from 'classnames';
import { ReactNode } from 'react';

import { Button } from 'uilib/components/Button/Button';
import { Size } from 'uilib/types';

import S from './Chip.styl';
import { Tooltip } from 'uilib/components/Tooltip/Tooltip';
import { Icon } from 'uilib/components/Icon/Icon';

type Props = {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  removeTooltip?: ReactNode;
  size?: Size;
};

export function Chip({
  children,
  className,
  selected,
  onRemove,
  onClick,
  removeTooltip,
  size = 'm',
}: Props) {
  const closeIcon = <Icon type="close" size={size} />;

  return (
    <div
      className={cn(
        S.chip,
        S[`size_${size}`],
        className,
        selected && S.selected
      )}
      onClick={onClick}
    >
      <span className={S.content}>{children}</span>
      {onRemove && (
        <Button
          round
          square
          variant="clear"
          size={size}
          className={S.remove}
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
        >
          {removeTooltip ? (
            <Tooltip content={removeTooltip}>{closeIcon}</Tooltip>
          ) : (
            closeIcon
          )}
        </Button>
      )}
    </div>
  );
}
