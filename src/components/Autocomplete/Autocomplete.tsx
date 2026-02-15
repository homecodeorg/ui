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

export function Autocomplete(props: T.Props) {
  const {
    className,
    inputWrapperClassName,
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
    inputProps = {},
    popupProps = {},
    menuProps = {},
  } = props;

  const isMounted = useIsMounted();
  const [filteredItems, setFilteredItems] = useState<T.Option[]>([]);
  const [currentFilter, setCurrentFilter] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [isFocused, setIsFocused] = useState(isOpen);
  const isFocusedRef = useRef(false);
  const searchValRef = useRef(value);
  const [searchValue, _setSearchValue] = useState(value);

  const setSearchValue = (val: string) => {
    searchValRef.current = val;
    _setSearchValue(val);
  };

  const currentRequest = useRef('');
  // @ts-ignore
  const inputRef = useRef<Input>(null);

  const displayItems = currentFilter ? filteredItems : items || [];
  const hasMore = currentFilter ? filteredItems.length < totalCount : false;
  const classes = cn(S.root, className, popupProps.className);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    setIsFocused(true);
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
      setCurrentFilter('');
      setFilteredItems([]);
      setCurrentOffset(0);
      setTotalCount(0);
    } else {
      setCurrentFilter(val);
      setCurrentOffset(0);
      fetchOptions(val, 0);
    }

    return true;
  };

  const handleSelect = (option: T.Option) => {
    setSearchValue(option.label);
    setCurrentFilter('');
    setFilteredItems([]);
    setCurrentOffset(0);
    setTotalCount(0);
    onSelect(option);

    // set input caret to the end
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      input.focus();
      input.setSelectionRange(value.length, value.length);
    });
  };

  const { focusedIndex, setFocusedIndex } = useListKeyboardControl({
    isActive: isOpen,
    itemsCount: displayItems.length,
    onSelect: index => handleSelect(displayItems[index]),
  });

  const fetchOptions = debounce(async (filter: string, offset: number) => {
    if (!filter) {
      setFilteredItems([]);
      return;
    }

    const requestKey = `${filter}:${offset}`;
    currentRequest.current = requestKey;

    if (offset === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const newOptions = await getOptions(filter, offset);

      if (!isMounted.current) return;
      if (currentRequest.current !== requestKey) return;

      if (offset === 0) {
        setFilteredItems(newOptions);
        setCurrentOffset(newOptions.length);
        setTotalCount(
          newOptions.length + (newOptions.length === pageSize ? 1 : 0)
        );
      } else {
        setFilteredItems(prev => [...prev, ...newOptions]);
        const newOffset = offset + newOptions.length;
        setCurrentOffset(newOffset);
        setTotalCount(newOffset + (newOptions.length === pageSize ? 1 : 0));
      }
    } catch (error) {
      if (offset === 0) {
        setFilteredItems([]);
        setCurrentOffset(0);
        setTotalCount(0);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, debounceDelay);

  const handleScrollEnd = useCallback(() => {
    if (currentFilter && hasMore && !isLoading && !isLoadingMore) {
      fetchOptions(currentFilter, currentOffset);
    }
  }, [
    currentFilter,
    hasMore,
    isLoading,
    isLoadingMore,
    currentOffset,
    fetchOptions,
  ]);

  useEffect(() => {
    if (typeof value !== 'string') return;
    setSearchValue(value);

    if (!value) {
      setCurrentFilter('');
      setFilteredItems([]);
      setCurrentOffset(0);
      setTotalCount(0);
    } else if (isFocusedRef.current) {
      setCurrentFilter(value);
      setCurrentOffset(0);
      fetchOptions(value, 0);
    }
  }, [value]);

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
      handleSelect,
      setFocusedIndex,
      props.renderItem,
    ]
  );

  const optionsList = useMemo(() => {
    if (!displayItems.length) return null;

    const computedTotalCount = currentFilter ? totalCount : displayItems.length;
    return (
      <VirtualizedListScroll
        className={cn(S.options, menuProps.className)}
        scrollProps={{
          y: true,
          innerClassName: S.inner,
          style: { height: '200px' },
        }}
        itemHeight={itemHeight}
        itemsCount={displayItems.length}
        totalCount={computedTotalCount}
        overlapCount={10}
        pageSize={pageSize}
        onScrollEnd={handleScrollEnd}
        renderItem={renderItem}
        contentAfter={
          hasMore &&
          isLoadingMore && (
            <div style={{ padding: '8px 12px', textAlign: 'center' }}>
              <Shimmer size={size} round={round} />
            </div>
          )
        }
      />
    );
  }, [
    displayItems,
    focusedIndex,
    currentFilter,
    totalCount,
    hasMore,
    isLoadingMore,
    itemHeight,
    pageSize,
    handleScrollEnd,
    renderItem,
    size,
    round,
    menuProps.className,
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
        <div className={inputWrapperClassName}>
          <Input
            ref={inputRef}
            // @ts-ignore
            size={size}
            round={round}
            {...inputProps}
            value={searchValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={inputProps.className}
          />
          {isLoading && (
            <Shimmer className={S.shimmer} size={size} round={round} />
          )}
        </div>
      }
      content={optionsList}
      contentProps={{
        ...popupProps?.contentProps,
        className: cn(S.popupContent, popupProps?.contentProps?.className),
      }}
    />
  );
}
