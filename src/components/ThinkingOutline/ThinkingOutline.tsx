import cn from 'classnames';

import S from './ThinkingOutline.styl';

export type ThinkingOutlineProps = {
  /** When omitted, hover on the outline drives the glow. */
  active?: boolean;
  className?: string;
};

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
