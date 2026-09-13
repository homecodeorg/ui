import { Fragment, useLayoutEffect, useRef } from 'react';
import cn from 'classnames';

import S from './Resizer.styl';
import * as T from './Resizer.types';

export type { Props as ResizerProps } from './Resizer.types';

const toPct = (n: number) => `${Number(n.toFixed(4))}%`;

function readPct(el: HTMLElement, prop: string, fallback: number) {
  return parseFloat(el.style.getPropertyValue(prop)) || fallback;
}

function writePct(el: HTMLElement, value: number) {
  const v = toPct(value);
  el.style.setProperty('--width', v);
  el.style.setProperty('--height', v);
}

export function Resizer({
  vertical = false,
  content,
  className,
  sizes,
}: T.Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panesRef = useRef<(HTMLDivElement | null)[]>([]);
  const n = content.length;
  const equal = n ? 100 / n : 0;
  const sizesKey = sizes?.join(' ') ?? '';

  useLayoutEffect(() => {
    panesRef.current.length = n;
    panesRef.current.forEach((el, i) => {
      if (el) writePct(el, sizes?.[i] ?? equal);
    });
  }, [n, equal, sizesKey]);

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
