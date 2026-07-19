import cn from 'classnames';
import type { CSSProperties } from 'react';

import S from './GridLayout.styl';
import type { Props } from './GridLayout.types';

export type { Props as GridLayoutProps } from './GridLayout.types';

export function GridLayout({
  children,
  colWidth = 300,
  gap = 'var(--p-2)',
  className,
  as: asProp,
}: Props) {
  const As = asProp ?? 'div';

  return (
    <As
      className={cn(S.root, className)}
      style={
        {
          maxWidth: '100%',
          gap,
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${colWidth}px, 1fr))`,
        } as CSSProperties
      }
    >
      {children}
    </As>
  );
}
