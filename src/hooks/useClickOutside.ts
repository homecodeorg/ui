import { RefObject } from 'react';

import useEvent from './useEvent';

export default function useClickOutside(
  elem: RefObject<HTMLElement>,
  callback: () => void,
  isActive = true
) {
  const handleClick = (e: MouseEvent) => {
    if (
      !elem.current?.contains(e.target as Node) &&
      document.body.contains(e.target as Node)
    ) {
      callback();
    }
  };

  useEvent({
    elem,
    event: 'click',
    callback: handleClick,
    isActive,
  });
}
