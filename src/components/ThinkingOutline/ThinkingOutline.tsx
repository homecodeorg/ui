import cn from 'classnames';

import S from './ThinkingOutline.styl';

export type ThinkingOutlineProps = {
  active?: boolean;
  className?: string;
};

export function ThinkingOutline({ active, className }: ThinkingOutlineProps) {
  return (
    <div className={cn(S.root, active && S.active, className)}>
      <div className={S.bloom} />
    </div>
  );
}
