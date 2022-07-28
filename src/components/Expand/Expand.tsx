import { useCallback, useEffect, useState } from 'react';
import { Button, Icon } from 'uilib';
import cn from 'classnames';

import S from './Expand.styl';
import * as T from './Expand.types';

export function Expand(props: T.Props) {
  const {
    className,
    size = 'm',
    header,
    headerClassName,
    content,
    contentProps = {},
    isOpen: initialOpen = false,
    onChange,
  } = props;

  const [isOpen, setIsOpen] = useState(initialOpen);
  const onHeaderClick = useCallback(() => {
    const value = !isOpen;
    setIsOpen(value);
    onChange?.(value);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(initialOpen);
  }, [initialOpen]);

  return (
    <div className={cn(S.root, isOpen && S.isOpen, className)}>
      <Button
        variant="clear"
        className={cn(S.header, headerClassName)}
        size={size}
        onClick={onHeaderClick}
      >
        {header}
        &nbsp;
        <Icon type="chevronRight" size={size} className={S.headerIcon} />
      </Button>
      {isOpen &&
        // @ts-ignore
        (content?.(contentProps) || <div {...contentProps}>{content}</div>)}
    </div>
  );
}
