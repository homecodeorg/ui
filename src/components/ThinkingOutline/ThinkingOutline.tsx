import cn from 'classnames';
import type { CSSProperties } from 'react';

import S from './ThinkingOutline.styl';
import {
  ThinkingOutlineGradient,
  ThinkingOutlineProps,
  ThinkingOutlineSize,
} from './ThinkingOutline.types';

export type {
  ThinkingOutlineGradient,
  ThinkingOutlineProps,
  ThinkingOutlineSize,
};

const BASE_DURATION = 3.5; // seconds per lap at speed 1
const DEFAULT_GRADIENTS: ThinkingOutlineGradient[] = [{}];

const toSize = (size?: ThinkingOutlineSize) =>
  typeof size === 'number' ? `${size}px` : size;

// Unset values stay undefined so the stylesheet defaults (and the root's vars) apply
const sizeVars = (
  thickness?: ThinkingOutlineSize,
  spread?: ThinkingOutlineSize
) => ({
  '--tol-thickness': toSize(thickness),
  '--tol-spread': toSize(spread),
});

function getLayerStyle({
  color,
  speed = 1,
  reverse,
  phase = 0,
  thickness,
  spread,
}: ThinkingOutlineGradient) {
  const duration = BASE_DURATION / (speed > 0 ? speed : 1);

  return {
    ...sizeVars(thickness, spread),
    '--tol-color': color,
    '--tol-color-soft':
      color && `color-mix(in srgb, ${color} 30%, transparent)`,
    '--tol-duration': speed !== 1 ? `${duration}s` : undefined,
    // Negative delay starts the orbit part-way through a lap
    '--tol-delay': phase ? `${-phase * duration}s` : undefined,
    '--tol-direction': reverse ? 'reverse' : undefined,
  } as CSSProperties;
}

export function ThinkingOutline({
  active,
  gradients,
  thickness,
  spread,
  className,
}: ThinkingOutlineProps) {
  const isControlled = active !== undefined;
  const layers = gradients?.length ? gradients : DEFAULT_GRADIENTS;

  return (
    <div
      className={cn(
        S.root,
        isControlled && active && S.active,
        !isControlled && S.interactive,
        className
      )}
      style={sizeVars(thickness, spread) as CSSProperties}
    >
      {layers.map((gradient, i) => (
        <div key={i} className={S.layer} style={getLayerStyle(gradient)}>
          <div className={S.bloom} />
        </div>
      ))}
    </div>
  );
}
