import S from './ThinkingOutline.styl';
import cn from 'classnames';

export type ThinkingOutlineProps = {
  active?: boolean;
  className?: string;
};

export function ThinkingOutline({
  active = false,
  className,
}: ThinkingOutlineProps) {
  return (
    <div className={cn(S.root, active && S.active, className)}>
      <div className={S.bloom} />
    </div>
  );
}
