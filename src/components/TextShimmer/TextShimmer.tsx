import cn from 'classnames';
import React, { useMemo } from 'react';

import S from './TextShimmer.styl';
import { TextShimmerProps } from './TextShimmer.types';

function TextShimmerComponent({
  children,
  as: Component = 'p',
  className,
  duration = 1,
  spread = 3,
  inverted = false,
  active = true,
}: TextShimmerProps) {
  const { backgroundGradient } = useMemo(() => {
    const raw = Math.min(
      48,
      3.5 + Math.max(0, Math.min(1, spread / 10)) * 100.5
    );
    // Wide blend stops “vertical knife” artefacts when the ramp only spans few pixels inside the glyph mask.
    const ridgeHalf = Math.min(49, Math.max(36, raw + 17));

    const baseColor = inverted
      ? 'var(--txt-sh-highlight)'
      : 'var(--txt-sh-fill)';
    const bandColor = inverted
      ? 'var(--txt-sh-fill)'
      : 'var(--txt-sh-highlight)';

    const backgroundGradient = `linear-gradient(90deg, ${baseColor} calc(50% - ${ridgeHalf}%), ${bandColor} 50%, ${baseColor} calc(50% + ${ridgeHalf}%))`;

    return { backgroundGradient };
  }, [spread, inverted]);

  if (!active) return <>{children}</>;

  return (
    <Component
      className={cn(S.root, className)}
      style={
        {
          '--text-shimmer-duration': `${duration}s`,
          backgroundImage: backgroundGradient,
        } as React.CSSProperties
      }
    >
      {children}
    </Component>
  );
}

export const TextShimmer = React.memo(TextShimmerComponent);
