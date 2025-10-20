import cn from 'classnames';
import { ReactNode } from 'react';

import { Button } from 'uilib/components/Button/Button';
import { Size } from 'uilib/types';

import S from './Chip.styl';
import { Tooltip } from 'uilib/components/Tooltip/Tooltip';
import { Icon } from 'uilib/components/Icon/Icon';

type ChipSize = 'xs' | 's' | 'm' | 'l';

type Props = {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  removeTooltip?: ReactNode;
  size?: ChipSize;
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
  const buttonSize: Size = size === 'xs' ? 's' : (size as Size);

  const closeIcon = <Icon type="close" size={buttonSize} />;

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
          size={buttonSize}
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
