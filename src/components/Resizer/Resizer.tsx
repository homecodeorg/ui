import { Fragment, useLayoutEffect, useRef } from 'react';
import cn from 'classnames';

import LS from 'uilib/tools/localStorage';

import S from './Resizer.styl';
import * as T from './Resizer.types';
import { clampAll, clampPair, isPxMin, minToPct } from './Resizer.helpers';

export type { Props as ResizerProps, SizeValue } from './Resizer.types';

const LS_PREFIX = 'ui:resizer:';

const toPct = (n: number) => `${Number(n.toFixed(4))}%`;

function readPct(el: HTMLElement, prop: string, fallback: number) {
  const n = parseFloat(el.style.getPropertyValue(prop));
  return Number.isFinite(n) ? n : fallback;
}

function writePct(el: HTMLElement, value: number) {
  const v = toPct(value);
  el.style.setProperty('--width', v);
  el.style.setProperty('--height', v);
}

function lsKey(rememberKey: string) {
  return `${LS_PREFIX}${rememberKey}`;
}

function isValidSizes(value: unknown, count: number): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === count &&
    value.every(n => typeof n === 'number' && Number.isFinite(n))
  );
}

function loadRemembered(rememberKey: string | undefined, count: number) {
  if (!rememberKey) return null;
  const stored = LS.get(lsKey(rememberKey));
  return isValidSizes(stored, count) ? stored : null;
}

function resolveSizes(
  n: number,
  equal: number,
  sizes: number[] | undefined,
  rememberKey: string | undefined
) {
  const remembered = loadRemembered(rememberKey, n);
  if (remembered) return remembered;
  return Array.from({ length: n }, (_, i) => sizes?.[i] ?? equal);
}

function minsToPct(
  minWidths: T.SizeValue[] | undefined,
  n: number,
  totalPx: number
) {
  return Array.from({ length: n }, (_, i) => minToPct(minWidths?.[i], totalPx));
}

function applySizes(
  panes: (HTMLDivElement | null)[],
  values: number[],
  mins: number[]
) {
  const next = clampAll(values, mins);
  panes.forEach((el, i) => {
    if (el) writePct(el, next[i]);
  });
  return next;
}

export function Resizer({
  vertical = false,
  content,
  className,
  sizes,
  minWidths,
  rememberKey,
}: T.Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panesRef = useRef<(HTMLDivElement | null)[]>([]);
  const n = content.length;
  const equal = n ? 100 / n : 0;
  const sizesKey = sizes?.join(' ') ?? '';
  const minKey = minWidths?.map(String).join(' ') ?? '';

  useLayoutEffect(() => {
    panesRef.current.length = n;
    const root = rootRef.current;
    const total = root ? (vertical ? root.clientHeight : root.clientWidth) : 0;
    applySizes(
      panesRef.current,
      resolveSizes(n, equal, sizes, rememberKey),
      minsToPct(minWidths, n, total)
    );
  }, [n, equal, sizesKey, rememberKey, minKey, vertical]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !minWidths?.some(isPxMin)) return;

    const apply = () => {
      const total = vertical ? root.clientHeight : root.clientWidth;
      const prop = vertical ? '--height' : '--width';
      const current = panesRef.current.map(el =>
        el ? readPct(el, prop, equal) : equal
      );
      applySizes(panesRef.current, current, minsToPct(minWidths, n, total));
    };

    const ro = new ResizeObserver(apply);
    ro.observe(root);
    return () => ro.disconnect();
  }, [n, equal, minKey, vertical]);

  const onPointerDown = (index: number) => (e: React.PointerEvent) => {
    const left = panesRef.current[index];
    const right = panesRef.current[index + 1];
    const root = rootRef.current;
    if (!left || !right || !root) return;

    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const prop = vertical ? '--height' : '--width';
    const startPos = vertical ? e.clientY : e.clientX;
    const total = vertical ? root.clientHeight : root.clientWidth;
    const startLeft = readPct(left, prop, equal);
    const startRight = readPct(right, prop, equal);
    const combined = startLeft + startRight;
    const minLeft = minToPct(minWidths?.[index], total);
    const minRight = minToPct(minWidths?.[index + 1], total);

    root.classList.add(S.dragging);
    document.body.style.userSelect = 'none';

    const onMove = (ev: PointerEvent) => {
      const pos = vertical ? ev.clientY : ev.clientX;
      const delta = ((pos - startPos) / total) * 100;
      const nextLeft =
        clampPair(startLeft + delta, combined, minLeft, minRight) ?? startLeft;
      writePct(left, nextLeft);
      writePct(right, combined - nextLeft);
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      root.classList.remove(S.dragging);
      document.body.style.removeProperty('user-select');
      if (rememberKey) {
        const current = panesRef.current.map(el =>
          el ? readPct(el, prop, equal) : equal
        );
        LS.set(lsKey(rememberKey), current);
      }
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  return (
    <div
      ref={rootRef}
      className={cn(S.root, vertical && S.vertical, className)}
    >
      {content.map((item, i) => (
        <Fragment key={i}>
          <div
            ref={el => {
              panesRef.current[i] = el;
            }}
            className={S.pane}
          >
            {item}
          </div>
          {i < n - 1 && (
            <div
              className={S.handle}
              role="separator"
              aria-label="Resize panes"
              aria-orientation={vertical ? 'horizontal' : 'vertical'}
              onPointerDown={onPointerDown(i)}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
