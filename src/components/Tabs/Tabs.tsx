import * as T from './Tabs.types';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '../Button/Button';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import S from './Tabs.styl';
import { Scroll } from '../Scroll/Scroll';
import cn from 'classnames';

const isId = id => ['string', 'number'].includes(typeof id);

export function Tabs(props: T.Props) {
  const {
    size = 'm',
    variant = 'default',
    className,
    tabsWrapperClassName,
    tabsInnerClassName,
    tabsClassName,
    contentClassName,
    items,
    hideTabsIfSingle = false,
    allowEmpty = false,
    onChange,
    renderAll,
    activeId: initialId,
    children,
    ...rest
  } = props;
  const [activeId, setActiveId] = useState(
    isId(initialId) ? initialId : allowEmpty ? null : items[0].id
  );

  useEffect(() => {
    if (isId(initialId)) {
      setActiveId(initialId);
    }
  }, [initialId]);

  const onTabClick = useCallback(
    (e, { id, onClick } = {} as T.Item) => {
      // @ts-ignore
      if (onClick && !onClick(e)) {
        e.preventDefault();
        return;
      }

      const newId = allowEmpty && id === activeId ? null : id;

      setActiveId(newId);
      onChange?.(newId);
    },
    [activeId]
  );

  const tabsContent = [];
  const tabsButtons = items.map((params: T.Item) => {
    const {
      id,
      label,
      forceRender,
      content,
      contentClassName: currContentClassName,
      ...rest
    } = params;
    const isActive = activeId === id;
    const tabContent =
      typeof content === 'function'
        ? (content as () => React.ReactNode)()
        : content;

    if (renderAll || forceRender || isActive) {
      tabsContent.push(
        <div
          className={cn(
            contentClassName,
            currContentClassName,
            !isActive && S.inactive
          )}
          key={id}
        >
          {tabContent}
        </div>
      );
    }

    return (
      <Button
        {...rest}
        className={cn(S.tab, isActive && S.active, rest.className)}
        size={size}
        key={id}
        onClick={e => onTabClick(e, params)}
        checked={isActive}
      >
        {label}
      </Button>
    );
  });

  const tabs =
    tabsButtons.length === 1 && hideTabsIfSingle ? null : (
      <Scroll
        x
        offset={{ x: { before: 10, after: 10 } }}
        className={tabsWrapperClassName}
        innerClassName={cn(S.tabsScroll, S[`size-${size}`], tabsInnerClassName)}
        autoHide
        fadeSize={size}
        size={size}
      >
        <ButtonGroup
          className={cn(
            variant === 'links' && S['variant-links'],
            tabsClassName
          )}
          {...rest}
        >
          {tabsButtons}
        </ButtonGroup>
      </Scroll>
    );

  if (typeof children === 'function') {
    return children({
      tabs,
      content: tabsContent,
    });
  }

  return (
    <>
      {tabs}
      {children}
      {tabsContent}
    </>
  );
}
