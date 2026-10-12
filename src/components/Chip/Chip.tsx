import cn from 'classnames';

import { Button } from 'uilib/components/Button/Button';

import S from './Chip.styl';
import * as T from './Chip.types';
import { Tooltip } from 'uilib/components/Tooltip/Tooltip';
import { Icon } from 'uilib/components/Icon/Icon';

export function Chip({
  children,
  className,
  selected,
  onRemove,
  onClick,
  removeTooltip,
  size = 'm',
}: T.Props) {
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
