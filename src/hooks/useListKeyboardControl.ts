import { useState } from 'react';

import { useCallback, useEffect } from 'react';

import useEvent from './useEvent';

type Props = {
  isActive: boolean;
  itemsCount: number;
  onSelect?: (index: number) => void;
};

export const useListKeyboardControl = ({
  isActive,
  itemsCount,
  onSelect,
}: Props) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      let newIndex = focusedIndex;

      const set = (index: number) => {
        e.preventDefault();
        e.stopPropagation();
        setFocusedIndex(index);
        return;
      };

      if (e.key === 'ArrowDown') {
        newIndex++;
        if (newIndex >= itemsCount) newIndex = 0;
        set(newIndex);
        return;
      }

      if (e.key === 'ArrowUp') {
        newIndex--;
        if (newIndex < 0) newIndex = itemsCount - 1;
        set(newIndex);
        return;
      }

      if (e.key === 'Enter') {
        onSelect(newIndex);
        return;
      }
    },
    [focusedIndex, itemsCount, onSelect]
  );

  useEvent({
    elem: document,
    event: 'keydown',
    callback: handleKeyDown,
    isActive,
  });

  useEffect(() => {
    if (itemsCount < focusedIndex) {
      setFocusedIndex(itemsCount - 1);
    }
  }, [itemsCount]);

  return {
    focusedIndex,
    setFocusedIndex,
  };
};
