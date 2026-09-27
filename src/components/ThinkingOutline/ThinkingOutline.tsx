import cn from 'classnames';

import S from './ThinkingOutline.styl';
import { ThinkingOutlineProps } from './ThinkingOutline.types';

export type { ThinkingOutlineProps };

export function ThinkingOutline({ active, className }: ThinkingOutlineProps) {
  const isControlled = active !== undefined;

  return (
    <div
      className={cn(
        S.root,
        isControlled && active && S.active,
        !isControlled && S.interactive,
        className
      )}
    >
      <div className={S.bloom} />
    </div>
  );
}
