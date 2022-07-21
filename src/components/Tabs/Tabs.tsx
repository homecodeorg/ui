import { useCallback, useRef, useState } from 'react';
// import cn from 'classnames';

import { Button } from '../Button/Button';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';

import * as T from './Tabs.types';
// import S from './Tabs.styl';

function isId(id) {
  return ['string', 'number'].includes(typeof id);
}

export function Tabs(props: T.Props) {
  const {
    items,
    onChange,
    renderAll,
    activeId: initialId,
    children,
    ...rest
  } = props;
  const [activeId, setActiveId] = useState(
    isId(initialId) ? initialId : items[0].id
  );
  const tabsContent = useRef([]);

  const onTabClick = useCallback((e, { id, onClick } = {}) => {
    if (onClick && !onClick(e)) {
      e.peventDefault();
      return;
    }

    setActiveId(id);
    onChange?.(id);
  }, []);

  tabsContent.current = [];

  const tabs = items.map((params: T.Item) => {
    const { id, label, forceRender, content, ...rest } = params;
    const isActive = activeId === id;

    if (renderAll || forceRender || isActive) {
      tabsContent.current.push(
        typeof content === 'function' ? content() : content
      );
    }

    return (
      <Button
        {...rest}
        key={id}
        onClick={e => onTabClick(e, params)}
        checked={isActive}
      >
        {label}
      </Button>
    );
  });

  if (typeof children === 'function') {
    return children({
      tabs: <ButtonGroup {...rest}>{tabs}</ButtonGroup>,
      content: tabsContent.current,
    });
  }

  return <>{tabsContent.current}</>;
}
