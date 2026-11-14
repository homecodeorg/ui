import cn from 'classnames';

import S from './Dots.styl';

type Props = {
  index: number;
  count: number;
  className?: string;
  // Makes each dot a button that jumps to its index (Stepper).
  onSelect?: (index: number) => void;
  // Accessible name of a dot, e.g. the step title.
  getLabel?: (index: number) => string;
};

export default function Dots({
  index,
  count,
  className,
  onSelect,
  getLabel,
}: Props) {
  return (
    <div className={cn(S.root, onSelect && S.interactive, className)}>
      <div className={S.inner}>
        {Array.from({ length: count }).map((_, i) => {
          const classes = cn(S.item, i === index && S.active);

          if (!onSelect) return <div key={i} className={classes} />;

          return (
            <button
              key={i}
              type="button"
              className={classes}
              aria-label={getLabel?.(i) ?? String(i + 1)}
              aria-current={i === index ? 'step' : undefined}
              onClick={() => onSelect(i)}
            />
          );
        })}
      </div>
    </div>
  );
}
