import * as T from './NestedMenu.types';

import { useEffect, useState, type MouseEvent } from 'react';

import { Icon } from 'uilib/components/Icon/Icon';
import { Popup } from 'uilib/components/Popup/Popup';
import S from './NestedMenu.styl';
import cn from 'classnames';

const MOBILE_MQ = '(max-width: 720px)';
const HOVER_MQ = '(hover: hover) and (pointer: fine)';

const ICON_SIZE = { xs: 'xs', s: 'xs', m: 'xs', l: 's', xl: 'm' } as const;

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

export function NestedMenuLabel({
  children,
  className,
}: T.NestedMenuLabelProps) {
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
  size = 'm',
  className,
  popupProps,
  onItemClick,
}: T.Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const stacked = useMedia(MOBILE_MQ);
  const canHover = useMedia(HOVER_MQ);
  const active = items.find(item => item.id === activeId);
  const iconSize = ICON_SIZE[size];
  const contentClass = cn(S.content, S[`size-${size}`]);

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
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function handleItemClick(id: string, e: { defaultPrevented: boolean }) {
    onItemClick?.(id);
    const item = items.find(entry => entry.id === id);
    if (!item || item.disabled) return;
    if (item.onClick && !item.submenu) {
      item.onClick(e as MouseEvent);
      if (item.closeOnClick !== false && !e.defaultPrevented) close();
      return;
    }
    if (!item.submenu) {
      if (item.closeOnClick !== false) close();
      return;
    }
    if (activeId === id && !stacked && !canHover) {
      setActiveId(null);
      return;
    }
    openSub(id, true);
  }

  function renderItemButton(item: T.NestedMenuItem) {
    return (
      <button
        type="button"
        className={cn(
          S.item,
          activeId === item.id && S.itemActive,
          item.danger && S.itemDanger,
          item.disabled && S.itemDisabled,
          item.wrap && S.wrap,
          item.className
        )}
        role="menuitem"
        disabled={item.disabled}
        aria-haspopup={item.submenu ? 'menu' : undefined}
        aria-expanded={item.submenu ? activeId === item.id : undefined}
        onPointerDown={e => {
          // Keep focus off underlying inputs (e.g. ChatSelector search).
          e.preventDefault();
          if (e.button === 0) handleItemClick(item.id, e);
        }}
        onKeyDown={e => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          handleItemClick(item.id, e);
        }}
      >
        {item.icon && (
          <span className={S.icon} aria-hidden>
            {item.icon}
          </span>
        )}
        {item.hint != null && item.hint !== '' ? (
          <span className={S.text}>
            <span className={S.label}>{item.label}</span>
            <span className={S.hint}>{item.hint}</span>
          </span>
        ) : (
          <span className={S.label}>{item.label}</span>
        )}
        {item.submenu && (
          <Icon className={S.chevron} type="chevronRight" size={iconSize} />
        )}
      </button>
    );
  }

  function renderItems() {
    return items.map(item => {
      if (item.submenu && !stacked) {
        return (
          <Popup
            key={item.id}
            {...popupProps}
            className={cn(S.itemPopup, popupProps?.className)}
            size={size}
            hoverControl={canHover}
            isOpen={activeId === item.id}
            onOpen={() => openSub(item.id, true)}
            onClose={() => {
              setActiveId(current => (current === item.id ? null : current));
            }}
            direction={align === 'end' ? 'left-top' : 'right-top'}
            trigger={renderItemButton(item)}
            triggerProps={{
              ...popupProps?.triggerProps,
              className: cn(S.itemTrigger, popupProps?.triggerProps?.className),
            }}
            contentProps={{
              ...popupProps?.contentProps,
              className: cn(contentClass, popupProps?.contentProps?.className),
            }}
            content={
              <div className={S.list} role="menu">
                {item.submenu}
              </div>
            }
          />
        );
      }

      return (
        <div
          key={item.id}
          className={S.itemWrap}
          onPointerEnter={() => {
            if (canHover && !stacked) setActiveId(null);
          }}
        >
          {renderItemButton(item)}
        </div>
      );
    });
  }

  if (items.length === 0) return null;

  return (
    <Popup
      {...popupProps}
      className={cn(S.root, className, popupProps?.className)}
      size={size}
      isOpen={open}
      onOpen={() => onOpenChange(true)}
      onClose={() => {
        onOpenChange(false);
        setActiveId(null);
      }}
      direction={
        popupProps?.direction ??
        (align === 'end' ? 'bottom-left' : 'bottom-right')
      }
      trigger={trigger}
      triggerProps={{
        ...popupProps?.triggerProps,
        className: cn(S.trigger, popupProps?.triggerProps?.className),
        onClick: () => onOpenChange(!open),
      }}
      contentProps={{
        ...popupProps?.contentProps,
        className: cn(contentClass, popupProps?.contentProps?.className),
      }}
      content={
        <div className={S.list} role="menu">
          {stacked && active ? (
            <div className={S.stacked}>
              <button
                type="button"
                className={S.back}
                onClick={() => setActiveId(null)}
              >
                <Icon type="chevronLeft" size={iconSize} />
                <span className={S.label}>{active.label}</span>
              </button>
              <div className={S.stackedBody}>{active.submenu}</div>
            </div>
          ) : (
            renderItems()
          )}
        </div>
      }
    />
  );
}

export const NestedMenu = Object.assign(NestedMenuComponent, {
  Item: NestedMenuItemRow,
  Label: NestedMenuLabel,
});
