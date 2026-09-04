import cn from 'classnames';
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from 'uilib/components/Button/Button';
import { Gap } from 'uilib/components/Gap/Gap';
import { Icon } from 'uilib/components/Icon/Icon';
import { Scroll } from 'uilib/components/Scroll/Scroll';

import S from './FoldedLine.styl';
import { FoldedLineActionsProvider } from './FoldedLineActionsContext';
import * as T from './FoldedLine.types';

export type FoldedLineProps = T.Props;

export function FoldedLine({
  trigger,
  children,
  defaultFolded = true,
  className,
  folded: foldedProp,
  onFoldedChange,
  onScrollInnerRef,
  hideFoldButton = false,
  showChevron = true,
  onScrollInner,
  contentScrolling = true,
  variant = 'default',
}: FoldedLineProps) {
  const [uncontrolledFolded, setUncontrolledFolded] = useState(defaultFolded);
  const isControlled = foldedProp !== undefined;
  const isFolded = isControlled ? foldedProp : uncontrolledFolded;
  const setFolded = (next: boolean) => {
    if (isControlled) onFoldedChange?.(next);
    else setUncontrolledFolded(next);
  };
  const [actions, setActions] = useState<Map<string, ReactNode>>(new Map());
  const triggerRef = useRef<HTMLDivElement>(null);
  const isClear = variant === 'clear';

  const registerAction = useCallback((id: string, node: ReactNode | null) => {
    setActions(prev => {
      const next = new Map(prev);
      if (node == null) next.delete(id);
      else next.set(id, node);
      return next;
    });
  }, []);

  useEffect(() => {
    if (isFolded) setActions(new Map());
  }, [isFolded]);

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return Boolean(
      target.closest(
        'a[href], button, [role="button"], input, textarea, select, label'
      )
    );
  };

  const handleClick = (e: MouseEvent) => {
    if (!children || isInteractiveTarget(e.target)) return;

    if (isClear || isFolded) {
      setFolded(!isFolded);
      return;
    }

    if (triggerRef.current?.contains(e.target as Node)) {
      setFolded(true);
    }
  };

  return (
    <div
      className={cn(
        S.root,
        isFolded && S.folded,
        Boolean(children) && S.hasChildren,
        isClear && S.clear,
        className
      )}
      onClick={handleClick}
    >
      <div
        ref={triggerRef}
        className={cn(Boolean(children) && S.triggerInteractive)}
      >
        {typeof trigger === 'function' ? trigger(isFolded) : trigger}
        {showChevron && <Icon type="chevronDown" className={S.chevron} />}
      </div>
      {!isFolded && children && (
        <div className={S.content}>
          <FoldedLineActionsProvider registerAction={registerAction}>
            {contentScrolling ? (
              <Scroll
                y
                size="s"
                autoHide
                className={S.scroll}
                innerClassName={S.scrollInner}
                offset={{ y: { before: 4, after: 14 } }}
                onInnerRef={onScrollInnerRef}
                onScroll={onScrollInner}
              >
                {children}
              </Scroll>
            ) : (
              <div className={S.scrollInner}>{children}</div>
            )}
            <div className={S.actions}>
              {Array.from(actions.values())}
              {!hideFoldButton && (
                <Button
                  size="xs"
                  onClick={e => {
                    e.stopPropagation();
                    setFolded(true);
                  }}
                >
                  <Icon type="chevronUp" size="s" />
                  Fold
                </Button>
              )}
            </div>
          </FoldedLineActionsProvider>
        </div>
      )}
    </div>
  );
}
