import cn from 'classnames';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Icon } from 'uilib/components/Icon/Icon';

import S from './NestedMenu.styl';
import * as T from './NestedMenu.types';

export type {
  NestedMenuItem,
  Props as NestedMenuProps,
} from './NestedMenu.types';

const MOBILE_MQ = '(max-width: 720px)';
const HOVER_MQ = '(hover: hover) and (pointer: fine)';

function useMedia(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [query]);

  return matches;
}

export function NestedMenuLabel({ children, className }: T.NestedMenuLabelProps) {
  return <span className={cn(S.label, className)}>{children}</span>;
}

export function NestedMenuItemRow({
  children,
  className,
  danger,
  disabled,
  href,
  target,
  rel,
  onClick,
}: T.NestedMenuRowProps) {
  const classes = cn(S.row, danger && S.itemDanger, className);

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function NestedMenuComponent({
  trigger,
  items,
  open,
  onOpenChange,
  align = 'end',
  className,
}: T.Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [flipLeft, setFlipLeft] = useState(false);
  const hoverTimer = useRef(0);
  const stacked = useMedia(MOBILE_MQ);
  const canHover = useMedia(HOVER_MQ);
  const active = items.find(item => item.id === activeId);

  function close() {
    onOpenChange(false);
    setActiveId(null);
  }

  function openSub(id: string, announce = false) {
    setActiveId(id);
    if (announce) {
      items.find(item => item.id === id)?.onSubmenuOpen?.();
    }
  }

  useEffect(() => {
    if (!open) {
      setActiveId(null);
      return undefined;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    setFlipLeft(window.innerWidth - rect.right < 280);
  }, [open, activeId]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  function onItemEnter(id: string) {
    if (!canHover || stacked) return;
    window.clearTimeout(hoverTimer.current);
    const item = items.find(entry => entry.id === id);
    if (item?.disabled || !item?.submenu) {
      setActiveId(null);
      return;
    }
    openSub(id, false);
  }

  function onItemLeave() {
    if (!canHover || stacked) return;
    hoverTimer.current = window.setTimeout(() => setActiveId(null), 160);
  }

  function onItemClick(id: string) {
    const item = items.find(entry => entry.id === id);
    if (!item || item.disabled) return;
    if (item.onClick && !item.submenu) {
      item.onClick();
      close();
      return;
    }
    if (activeId === id && !stacked) {
      setActiveId(null);
      return;
    }
    openSub(id, true);
  }

  function renderItems() {
    return items.map(item => (
      <div
        key={item.id}
        className={S.itemWrap}
        onMouseEnter={() => onItemEnter(item.id)}
        onMouseLeave={onItemLeave}
      >
        <button
          type="button"
          className={cn(
            S.item,
            activeId === item.id && S.itemActive,
            item.danger && S.itemDanger,
            item.disabled && S.itemDisabled,
            item.className
          )}
          role="menuitem"
          disabled={item.disabled}
          aria-haspopup={item.submenu ? 'menu' : undefined}
          aria-expanded={item.submenu ? activeId === item.id : undefined}
          onClick={() => onItemClick(item.id)}
        >
          {item.icon && (
            <span className={S.icon} aria-hidden>
              {item.icon}
            </span>
          )}
          <span className={S.label}>{item.label}</span>
          {item.hint != null && item.hint !== '' && (
            <span className={S.hint}>{item.hint}</span>
          )}
          {item.submenu && (
            <Icon className={S.chevron} type="chevronRight" size="xs" />
          )}
        </button>
        {!stacked && activeId === item.id && item.submenu && (
          <div
            className={cn(S.submenu, flipLeft && S.submenuLeft)}
            role="menu"
            onMouseEnter={() => {
              window.clearTimeout(hoverTimer.current);
            }}
          >
            {item.submenu}
          </div>
        )}
      </div>
    ));
  }

  return (
    <div ref={rootRef} className={cn(S.root, className)}>
      <div className={S.trigger} onClick={() => onOpenChange(!open)}>
        {trigger}
      </div>
      {open && (
        <div className={cn(S.popup, align === 'end' && S.alignEnd)} role="menu">
          {stacked && active && (
            <div className={S.stacked}>
              <button
                type="button"
                className={S.back}
                onClick={() => setActiveId(null)}
              >
                <Icon type="chevronLeft" size="xs" />
                <span className={S.label}>{active.label}</span>
              </button>
              <div className={S.stackedBody}>{active.submenu}</div>
            </div>
          )}
          {(!stacked || !active) && renderItems()}
        </div>
      )}
    </div>
  );
}

export const NestedMenu = Object.assign(NestedMenuComponent, {
  Item: NestedMenuItemRow,
  Label: NestedMenuLabel,
});
