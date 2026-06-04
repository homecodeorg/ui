import cn from 'classnames';
import {
  useCallback,
  useRef,
  useState,
  ChangeEvent,
  CSSProperties,
} from 'react';

import { Tooltip } from '../Tooltip/Tooltip';
import S from './Slider.styl';
import * as T from './Slider.types';

export type SliderProps = T.Props;
export type SliderMarker = T.SliderMarker;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const valueToPct = (value: number, min: number, max: number) => {
  const range = max - min;
  return range > 0 ? `${((value - min) / range) * 100}%` : '0%';
};

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
  markers,
  markerClassName,
  onMarkerClick,
  onChange,
  onInput,
  markerTooltipProps = {},
  ...inputProps
}: SliderProps) {
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const [ghostRatio, setGhostRatio] = useState<number | null>(null);

  const range = max - min;
  const progressPct = valueToPct(value, min, max);

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
        className={cn(S.trackWrap, markers?.length ? S.hasMarkers : null)}
        onPointerEnter={
          showGhost ? e => updateGhostFromPointer(e.clientX) : undefined
        }
        onPointerMove={
          showGhost ? e => updateGhostFromPointer(e.clientX) : undefined
        }
        onPointerLeave={showGhost ? clearGhost : undefined}
      >
        <div className={S.trackRow}>
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
        {markers?.length ? (
          <div className={S.markersRow}>
            {markers.map((marker, index) => {
              const markerButton = (
                <button
                  type="button"
                  className={cn(S.marker, markerClassName)}
                  aria-label={
                    typeof marker.label === 'string' ? marker.label : undefined
                  }
                  disabled={disabled}
                  onPointerDown={e => {
                    e.stopPropagation();
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    if (!disabled) onMarkerClick?.(marker.value);
                  }}
                />
              );

              return (
                <span
                  key={marker.key ?? index}
                  className={S.markerWrap}
                  style={{ left: valueToPct(marker.value, min, max) }}
                >
                  {marker.label ? (
                    <Tooltip
                      direction="bottom"
                      {...markerTooltipProps}
                      content={marker.label}
                    >
                      {markerButton}
                    </Tooltip>
                  ) : (
                    markerButton
                  )}
                </span>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
