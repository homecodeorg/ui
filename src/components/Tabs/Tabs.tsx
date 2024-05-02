import { useCallback, useRef, useState } from 'react';

import cn from 'classnames';

import { Button } from '../Button/Button';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';

import * as T from './Tabs.types';
import S from './Tabs.styl';

function isId(id) {
  return ['string', 'number'].includes(typeof id);
}

export function Tabs(props: T.Props) {
  const {
    size = 'm',
    className,
    contentClassName,
    items,
    hideTabsIfSingle = true,
    onChange,
    renderAll,
    activeId: initialId,
    children,
    ...rest
  } = props;
  const [activeId, setActiveId] = useState(
    isId(initialId) ? initialId : items[0].id
  );
  const onTabClick = useCallback((e, { id, onClick } = {} as T.Item) => {
    // @ts-ignore
    if (onClick && !onClick(e)) {
      e.peventDefault();
      return;
    }

    setActiveId(id);
    onChange?.(id);
  }, []);

  const tabsContent = [];
  const tabsButtons =
    items.length === 1 && hideTabsIfSingle
      ? []
      : items.map((params: T.Item) => {
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
            typeof content === 'function' ? content() : content;

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
              size={size}
              key={id}
              onClick={e => onTabClick(e, params)}
              checked={isActive}
            >
              {label}
            </Button>
          );
        });

  const tabs = (
    <ButtonGroup className={className} {...rest}>
      {tabsButtons}
    </ButtonGroup>
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
