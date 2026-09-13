import { Fragment, useLayoutEffect, useRef } from 'react';
import cn from 'classnames';

import LS from 'uilib/tools/localStorage';

import S from './Resizer.styl';
import * as T from './Resizer.types';

export type { Props as ResizerProps } from './Resizer.types';

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

export function Resizer({
  vertical = false,
  content,
  className,
  sizes,
  rememberKey,
}: T.Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panesRef = useRef<(HTMLDivElement | null)[]>([]);
  const n = content.length;
  const equal = n ? 100 / n : 0;
  const sizesKey = sizes?.join(' ') ?? '';

  useLayoutEffect(() => {
    panesRef.current.length = n;
    const next = resolveSizes(n, equal, sizes, rememberKey);
    panesRef.current.forEach((el, i) => {
      if (el) writePct(el, next[i]);
    });
  }, [n, equal, sizesKey, rememberKey]);

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

    root.classList.add(S.dragging);
    document.body.style.userSelect = 'none';

    const onMove = (ev: PointerEvent) => {
      const pos = vertical ? ev.clientY : ev.clientX;
      const delta = ((pos - startPos) / total) * 100;
      let nextLeft = startLeft + delta;
      let nextRight = startRight - delta;
      if (nextLeft < 0) {
        nextLeft = 0;
        nextRight = combined;
      } else if (nextRight < 0) {
        nextRight = 0;
        nextLeft = combined;
      }
      writePct(left, nextLeft);
      writePct(right, nextRight);
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
              aria-orientation={vertical ? 'horizontal' : 'vertical'}
              onPointerDown={onPointerDown(i)}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
