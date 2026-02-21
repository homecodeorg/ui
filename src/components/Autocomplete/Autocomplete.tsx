import * as T from './Autocomplete.types';

import { Input, Menu, Popup, VirtualizedListScroll } from 'uilib/components';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import S from './Autocomplete.styl';
import { Shimmer } from 'uilib/components/Shimmer/Shimmer';
import { Size } from 'uilib/types';
import cn from 'classnames';
import debounce from 'uilib/tools/debounce';
import { useIsMounted } from 'uilib/hooks/useIsMounted';
import { useListKeyboardControl } from 'uilib/hooks/useListKeyboardControl';

const SIZE_TO_ITEM_HEIGHT: Record<Size, number> = {
  s: 30,
  m: 40,
  l: 50,
};

const getTotalCount = (
  total?: number,
  newItemsCount: number = 0,
  offset: number = 0,
  pageSize: number = 20
) => {
  if (total !== undefined) return total;
  return offset + (newItemsCount === pageSize ? 1 : 0);
};

export function Autocomplete(props: T.Props) {
  const {
    className,
    value,
    onChange,
    size = 'm' as Size,
    getOptions,
    onSelect,
    items,
    itemHeight = SIZE_TO_ITEM_HEIGHT[size],
    pageSize = 20,
    debounceDelay = 300,
    round = false,
    blur = false,
    selectable = false,
    defaultSelected,
    scrollToSelected = false,
    inputProps = {},
    popupProps = {},
    menuProps = {},
    scrollProps = {},
    loadingPlaceholder,
    isOpen,
  } = props;

  const isMounted = useIsMounted();
  const [filteredItems, setFilteredItems] = useState<T.Option[]>([]);
  const [itemsWithoutFilter, setItemsWithoutFilter] = useState<T.Option[]>(
    () => items ?? []
  );
  const [currentFilter, setCurrentFilter] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [scrollTop, setScrollTop] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFocused, setIsFocused] = useState(isOpen);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const isFocusedRef = useRef(false);
  const searchValRef = useRef(value);
  const [searchValue, _setSearchValue] = useState(value);

  const setSearchValue = (val: string) => {
    searchValRef.current = val;
    _setSearchValue(val);
  };

  const currentRequest = useRef('');
  const savedScrollTopRef = useRef<number | undefined>(undefined);
  const defaultSelectedAppliedRef = useRef(false);
  // @ts-ignore
  const inputRef = useRef<Input>(null);

  const inputDisplayValue =
    selectable && !isFocused && selectedLabel != null
      ? selectedLabel
      : searchValue;

  const displayItems = currentFilter
    ? filteredItems
    : itemsWithoutFilter.length
    ? itemsWithoutFilter
    : items ?? [];
  const displayCount = displayItems.length;
  const hasMore = totalCount > 0 && displayCount < totalCount;
  const classes = cn(S.root, className, popupProps.className);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    setIsFocused(true);
    if (!scrollToSelected || !selectable || !selectedId) {
      const saved = savedScrollTopRef.current;
      if (saved != null && saved > 0) {
        setScrollTop(saved);
        requestAnimationFrame(() => setScrollTop(undefined));
      }
    }
    inputProps?.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = false;
    setIsFocused(false);
    inputProps?.onBlur?.(e);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const val = (value || e?.target.value) ?? '';
    setSearchValue(val);
    onChange(e, val);

    if (!val) {
      savedScrollTopRef.current = undefined;
      setCurrentFilter('');
      setFilteredItems([]);
      setItemsWithoutFilter(items ?? []);
      setCurrentOffset(0);
      setTotalCount(0);
      setScrollTop(0); // Reset scroll when filter is cleared
    } else {
      savedScrollTopRef.current = undefined;
      setCurrentFilter(val);
      setCurrentOffset(0);
      setScrollTop(0); // Reset scroll when filter changes
      fetchOptions(val, 0);
    }

    return true;
  };

  const handleSelect = (option: T.Option) => {
    if (selectable) {
      setSelectedId(option.id);
      setSelectedLabel(option.label);
      onSelect?.(option);
      return;
    }

    setSearchValue(option.label);
    setCurrentFilter(option.label);
    setFilteredItems([]);
    setCurrentOffset(0);
    setTotalCount(0);
    fetchOptionsCore(option.label, 0);
    onSelect?.(option);

    // set input caret to the end
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      input.focus();
      input.setSelectionRange(option.label.length, option.label.length);
    });
  };

  const { focusedIndex, setFocusedIndex } = useListKeyboardControl({
    isActive: isOpen,
    itemsCount: displayItems.length,
    onSelect: index => handleSelect(displayItems[index]),
  });

  const fetchOptionsCore = useCallback(
    async (filter: string, offset: number) => {
      const requestKey = `${filter}:${offset}`;
      currentRequest.current = requestKey;

      if (offset === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const result = await getOptions(filter, offset);
        const newOptions = result.items;
        const total = result.total;

        if (!isMounted.current) return;
        if (currentRequest.current !== requestKey) return;

        const newTotal = getTotalCount(
          total,
          newOptions.length,
          offset + newOptions.length,
          pageSize
        );

        if (filter) {
          if (offset === 0) {
            savedScrollTopRef.current = undefined;
            setFilteredItems(newOptions);
            setScrollTop(0); // Reset scroll when new filter results load
          } else {
            setFilteredItems(prev => [...prev, ...newOptions]);
          }
          setCurrentOffset(offset + newOptions.length);
          setTotalCount(newTotal);
        } else {
          if (offset === 0) {
            savedScrollTopRef.current = undefined;
            setItemsWithoutFilter(newOptions);
            setScrollTop(0); // Reset scroll when loading initial items
          } else {
            setItemsWithoutFilter(prev => [...prev, ...newOptions]);
          }
          setCurrentOffset(offset + newOptions.length);
          setTotalCount(newTotal);
        }

        // Clear scrollTop after reset to allow normal scrolling
        if (offset === 0) {
          requestAnimationFrame(() => {
            setScrollTop(undefined);
          });
        }
      } catch (error) {
        if (offset === 0) {
          if (filter) {
            setFilteredItems([]);
          } else {
            setItemsWithoutFilter(items ?? []);
          }
          setCurrentOffset(0);
          setTotalCount(0);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [getOptions, isMounted, pageSize, items]
  );

  const fetchOptions = useMemo(
    () => debounce(fetchOptionsCore, debounceDelay),
    [fetchOptionsCore, debounceDelay]
  );

  const handleScroll = useCallback(
    ({ scrollTop: top }: { scrollTop: number }) => {
      savedScrollTopRef.current = top;
    },
    []
  );

  const handleScrollEnd = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) return;
    const filter = currentFilter;
    const offset = currentOffset;
    if (offset > 0) {
      setIsLoadingMore(true);
      requestAnimationFrame(() => {
        fetchOptionsCore(filter, offset);
      });
    } else {
      fetchOptionsCore(filter, offset);
    }
  }, [
    currentFilter,
    hasMore,
    isLoading,
    isLoadingMore,
    currentOffset,
    fetchOptionsCore,
  ]);

  useEffect(() => {
    if (typeof value !== 'string') return;
    setSearchValue(value);

    if (!value) {
      savedScrollTopRef.current = undefined;
      setCurrentFilter('');
      setFilteredItems([]);
      setItemsWithoutFilter(items ?? []);
      setCurrentOffset(0);
      setTotalCount(0);
      setScrollTop(0); // Reset scroll when value is cleared
    } else if (isFocusedRef.current) {
      savedScrollTopRef.current = undefined;
      setCurrentFilter(value);
      setCurrentOffset(0);
      setScrollTop(0); // Reset scroll when filter changes
      fetchOptions(value, 0);
    }
  }, [value]);

  useEffect(() => {
    if (selectable && !value) {
      setSelectedId(null);
      setSelectedLabel(null);
      defaultSelectedAppliedRef.current = false;
    }
  }, [selectable, value]);

  useEffect(() => {
    if (
      selectable &&
      defaultSelected &&
      !defaultSelectedAppliedRef.current &&
      displayItems.length
    ) {
      const item = displayItems.find(o => o.id === defaultSelected);
      if (item) {
        defaultSelectedAppliedRef.current = true;
        setSelectedId(item.id);
        setSelectedLabel(item.label);
      }
    }
  }, [selectable, defaultSelected, displayItems]);

  useEffect(() => {
    if (!currentFilter && items?.length) {
      setItemsWithoutFilter(items);
    }
  }, [currentFilter, items]);

  useEffect(() => {
    const open = isOpen ?? isFocused;
    if (open && !currentFilter && items?.length && totalCount === 0) {
      fetchOptionsCore('', 0);
    }
  }, [
    isOpen,
    isFocused,
    currentFilter,
    items?.length,
    totalCount,
    fetchOptionsCore,
  ]);


  const renderItem = useCallback(
    (itemProps: {
      key: number;
      className?: string;
      style?: React.CSSProperties;
    }) => {
      const option = displayItems[itemProps.key];
      if (!option) return null;

      const itemPropsForRender: T.RenderItemProps = {
        option,
        key: itemProps.key,
        className: cn(S.option, itemProps.className),
        style: itemProps.style,
        focused: focusedIndex === itemProps.key,
        isSelected: selectable && option.id === selectedId,
        onClick: () => handleSelect(option),
        onMouseEnter: () => setFocusedIndex(itemProps.key),
      };

      if (props.renderItem) {
        return props.renderItem(itemPropsForRender);
      }

      return (
        <Menu.Item
          {...itemProps}
          focused={itemPropsForRender.focused}
          selected={itemPropsForRender.isSelected}
          className={itemPropsForRender.className}
          onClick={itemPropsForRender.onClick}
          onMouseEnter={itemPropsForRender.onMouseEnter}
          style={itemPropsForRender.style}
        >
          {option.render ? option.render(option) : option.label}
        </Menu.Item>
      );
    },
    [
      displayItems,
      focusedIndex,
      selectedId,
      selectable,
      handleSelect,
      setFocusedIndex,
      props.renderItem,
    ]
  );

  const LoadingPlaceholder = loadingPlaceholder ?? (
    <div className={S.loadingPlaceholder}>
      {isLoadingMore && <Shimmer size={size} round={round} />}
      Loading...
    </div>
  );

  const optionsList = useMemo(() => {
    if (!displayItems.length) {
      return !selectable && isLoading ? LoadingPlaceholder : null;
    }

    const computedTotalCount =
      totalCount > 0 ? totalCount : displayItems.length;

    const open = isOpen ?? isFocused;
    let initialScrollTop: number | undefined;
    if (open && scrollToSelected && selectable && selectedId) {
      const idx = displayItems.findIndex(o => o.id === selectedId);
      initialScrollTop =
        idx >= 0 ? Math.max(0, idx * itemHeight - itemHeight) : undefined;
    }

    return (
      <VirtualizedListScroll
        {...(selectable && { id: selectedId ?? 'none' })}
        {...(typeof initialScrollTop === 'number' && {
          initialScrollTop,
        })}
        className={cn(S.options, menuProps.className)}
        scrollProps={{
          y: true,
          ...scrollProps,
          className: cn(S.scroll, scrollProps?.className),
        }}
        itemHeight={itemHeight}
        itemsCount={displayItems.length}
        totalCount={computedTotalCount}
        overlapCount={10}
        pageSize={pageSize}
        scrollTop={scrollTop}
        onScroll={handleScroll}
        onScrollEnd={handleScrollEnd}
        renderItem={renderItem}
        contentAfter={hasMore && LoadingPlaceholder}
      />
    );
  }, [
    displayItems,
    focusedIndex,
    totalCount,
    hasMore,
    isLoading,
    isLoadingMore,
    itemHeight,
    pageSize,
    handleScroll,
    handleScrollEnd,
    renderItem,
    size,
    round,
    menuProps.className,
    scrollProps,
    scrollTop,
    selectable,
    selectedId,
    isOpen,
    isFocused,
    scrollToSelected,
    LoadingPlaceholder,
  ]);

  return (
    <Popup
      className={classes}
      isOpen={isOpen}
      focusControl
      round={round}
      size={size}
      blur={blur}
      direction="bottom"
      {...popupProps}
      trigger={
        <Input
          ref={inputRef}
          // @ts-ignore
          size={size}
          round={round}
          {...inputProps}
          value={inputDisplayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            inputProps.className,
            selectable && !isFocused && S.inputSelectableDisplay
          )}
        />
      }
      content={optionsList}
      contentProps={{
        ...popupProps?.contentProps,
        className: cn(S.popupContent, popupProps?.contentProps?.className),
      }}
    />
  );
}
