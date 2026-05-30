import cn from 'classnames';
import { useCallback, useRef, useState, ChangeEvent, CSSProperties } from 'react';

import S from './Slider.styl';
import * as T from './Slider.types';

export type SliderProps = T.Props;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function Slider({
  className,
  label,
  value,
  min = 0,
  max = 100,
  step,
  size = 'm',
  disabled = false,
  showGhost = false,
  onChange,
  onInput,
  ...inputProps
}: SliderProps) {
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const [ghostRatio, setGhostRatio] = useState<number | null>(null);

  const range = max - min;
  const progressPct =
    range > 0 ? `${((value - min) / range) * 100}%` : '0%';

  const updateGhostFromPointer = useCallback(
    (clientX: number) => {
      if (disabled || !showGhost) return;
      const wrap = trackWrapRef.current;
      if (!wrap) return;
      const { left, width } = wrap.getBoundingClientRect();
      if (width <= 0) return;
      setGhostRatio(clamp((clientX - left) / width, 0, 1));
    },
    [disabled, showGhost]
  );

  const clearGhost = useCallback(() => setGhostRatio(null), []);

  const classes = cn(
    S.root,
    S[`size-${size}`],
    disabled && S.disabled,
    label && S.hasLabel,
    className
  );

  return (
    <div className={classes}>
      {label ? <span className={S.label}>{label}</span> : null}
      <div
        ref={trackWrapRef}
        className={S.trackWrap}
        onPointerEnter={
          showGhost ? e => updateGhostFromPointer(e.clientX) : undefined
        }
        onPointerMove={
          showGhost ? e => updateGhostFromPointer(e.clientX) : undefined
        }
        onPointerLeave={showGhost ? clearGhost : undefined}
      >
        <input
          type="range"
          className={S.control}
          style={{ '--progress': progressPct } as CSSProperties}
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onInput={e => {
            onInput?.(e);
            onChange?.(
              Number(e.currentTarget.value),
              e as ChangeEvent<HTMLInputElement>
            );
          }}
          {...inputProps}
        />
        {showGhost && ghostRatio !== null && !disabled ? (
          <span
            className={S.ghost}
            style={{ left: `${ghostRatio * 100}%` }}
            aria-hidden
          />
        ) : null}
      </div>
    </div>
  );
}
