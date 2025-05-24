import cn from 'classnames';

import { ProgressProps } from './Progress.types';
import { calculateProgress } from './Progress.helpers';
import S from './Progress.styl';

export function Progress({
  value,
  showPercentage,
  size = 'm',
  alignText = 'center',
}: ProgressProps) {
  const progress = calculateProgress(value);
  const classes = cn(
    S.root,
    S[`size-${size}`],
    S[`align-${alignText}`],
    value > 0 && S.animated
  );

  return (
    <div className={classes}>
      <div className={S.bar} style={{ width: `${progress}%` }} />
      {showPercentage && <div className={S.label}>{Math.round(progress)}%</div>}
    </div>
  );
}
