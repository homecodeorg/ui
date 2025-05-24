import cn from 'classnames';

import { ProgressCircularProps } from './ProgressCircular.types';
import { calculateProgress } from '../Progress/Progress.helpers';
import S from './ProgressCircular.styl';

const SIZE_MAP = {
  s: 20,
  m: 30,
  l: 60,
  xl: 120,
};

export type { ProgressCircularProps } from './ProgressCircular.types';

export function ProgressCircular({
  value,
  showPercentage,
  size = 'm',
  strokeWidth,
  className,
}: ProgressCircularProps) {
  const progress = calculateProgress(value);
  const pixelSize = SIZE_MAP[size];
  const calculatedStrokeWidth = strokeWidth ?? pixelSize / 10;
  const radius = (pixelSize - calculatedStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox={`0 0 ${pixelSize} ${pixelSize}`}
      className={cn(S.root, value > 0 && S.animated, className)}
    >
      {/* Background cirecle */}
      <circle
        className={S.background}
        cx={pixelSize / 2}
        cy={pixelSize / 2}
        r={radius}
        fill="none"
        strokeWidth={calculatedStrokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={pixelSize / 2}
        cy={pixelSize / 2}
        r={radius}
        fill="none"
        stroke="var(--active-color)"
        strokeWidth={calculatedStrokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${pixelSize / 2} ${pixelSize / 2})`}
        className={S.progress}
      />
      {/* Display percentage in the center */}
      {showPercentage && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="bold"
        >
          {Math.round(progress)}%
        </text>
      )}
    </svg>
  );
}
