import cn from 'classnames';
import {
  useCallback,
  useRef,
  useState,
  ChangeEvent,
  CSSProperties,
  type Ref,
  type MutableRefObject,
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

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') ref(value);
  else (ref as MutableRefObject<T | null>).current = value;
}

export function Slider({
  className,
  label,
  value,
  defaultValue,
  inputRef,
  min = 0,
  max = 100,
  step,
  size = 'm',
  disabled = false,
  showGhost = false,
  vertical = false,
  markers,
  markerClassName,
  onMarkerClick,
  onChange,
  onInput,
  markerTooltipProps = {},
  ...inputProps
}: SliderProps) {
  const trackWrapRef = useRef<HTMLDivElement>(null);
  const localInputRef = useRef<HTMLInputElement | null>(null);
  const [ghostRatio, setGhostRatio] = useState<number | null>(null);

  const isControlled = value !== undefined;

  const setInputRef = useCallback(
    (el: HTMLInputElement | null) => {
      localInputRef.current = el;
      assignRef(inputRef, el);
    },
    [inputRef]
  );

  const getProgressPct = () => {
    if (isControlled) return valueToPct(value, min, max);
    const live = localInputRef.current?.valueAsNumber;
    if (Number.isFinite(live)) return valueToPct(live, min, max);
    return valueToPct(defaultValue ?? min, min, max);
  };

  const updateGhostFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled || !showGhost) return;
      const wrap = trackWrapRef.current;
      if (!wrap) return;
      const { left, top, width, height } = wrap.getBoundingClientRect();

      if (vertical) {
        if (height <= 0) return;
        // writing-mode vertical-lr + direction rtl → max at top
        setGhostRatio(clamp(1 - (clientY - top) / height, 0, 1));
        return;
      }

      if (width <= 0) return;
      setGhostRatio(clamp((clientX - left) / width, 0, 1));
    },
    [disabled, showGhost, vertical]
  );

  const clearGhost = useCallback(() => setGhostRatio(null), []);

  const classes = cn(
    S.root,
    S[`size-${size}`],
    vertical && S.vertical,
    disabled && S.disabled,
    label && S.hasLabel,
    className
  );

  const ghostStyle = vertical
    ? { bottom: `${(ghostRatio ?? 0) * 100}%` }
    : { left: `${(ghostRatio ?? 0) * 100}%` };

  return (
    <div className={classes}>
      {label ? <span className={S.label}>{label}</span> : null}
      <div
        ref={trackWrapRef}
        className={cn(S.trackWrap, markers?.length ? S.hasMarkers : null)}
        onPointerEnter={
          showGhost
            ? e => updateGhostFromPointer(e.clientX, e.clientY)
            : undefined
        }
        onPointerMove={
          showGhost
            ? e => updateGhostFromPointer(e.clientX, e.clientY)
            : undefined
        }
        onPointerLeave={showGhost ? clearGhost : undefined}
      >
        <div className={S.trackRow}>
          <input
            type="range"
            className={S.control}
            style={{ '--progress': getProgressPct() } as CSSProperties}
            ref={setInputRef}
            {...(isControlled
              ? { value }
              : { defaultValue: defaultValue ?? min })}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-orientation={vertical ? 'vertical' : 'horizontal'}
            onInput={e => {
              const next = Number(e.currentTarget.value);
              e.currentTarget.style.setProperty(
                '--progress',
                valueToPct(next, min, max)
              );
              onInput?.(e);
              onChange?.(next, e as ChangeEvent<HTMLInputElement>);
            }}
            {...(vertical ? ({ orient: 'vertical' } as object) : null)}
            {...inputProps}
          />
          {showGhost && ghostRatio !== null && !disabled ? (
            <span className={S.ghost} style={ghostStyle} aria-hidden />
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

              const markerPos = valueToPct(marker.value, min, max);
              const markerStyle = vertical
                ? { bottom: markerPos }
                : { left: markerPos };

              return (
                <span
                  key={marker.key ?? index}
                  className={S.markerWrap}
                  style={markerStyle}
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
