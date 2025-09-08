import * as H from './Select.helpers';
import * as T from './Select.types';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { INTERACTION_MODE, getInteractionMode } from 'uilib/tools/dom';

import cn from 'classnames';
import omit from 'lodash.omit';

import { AssistiveText } from '../AssistiveText/AssistiveText';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Icon } from '../Icon/Icon';
import { Label } from '../Label/Label';
import { Popup } from '../Popup/Popup';
import { RequiredStar } from '../RequiredStar/RequiredStar';
import { Scroll } from '../Scroll/Scroll';
import { useThrottle } from 'uilib/hooks/useThrottle';
import useEvent from 'uilib/hooks/useEvent';

import S from './Select.styl';

export function Select2(props: T.Props) {
  const {
    className,
    value,
    onChange,
    onSearchChange,
    disableTriggerArrow,
    inputProps,
    popupProps,
    scrollProps,
    size = 'm',
    round,
    optionClassName,
    additionalOptions = [],
    options,
    variant,
    label,
    error,
    blur,
    disabled,
    trigger,
    required,
    hideRequiredStar,
    isSearchable,
    presets = [],
    selectAllButton,
    clearButton,
    showSelectedCount,
    disableLabel,
  } = props;
  const isMultiple = H.isMultiple(value);
  const closeOnSelect = props.closeOnSelect ?? !isMultiple;

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollInnerRef = useRef<HTMLDivElement>(null);
  const focusedItemId = useRef<T.Id | null>(null);
  const focusedElem = useRef<HTMLDivElement | null>(null);
  const maxIndex = useRef(-1);
  const isFirstSelectedMeet = useRef(false);

  const searchValLower = useRef('');
  const [searchVal, _setSearchVal] = useState('');
  const setSearchVal = (val: string) => {
    _setSearchVal(val);
    searchValLower.current = val.toLowerCase();
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [labelClipPath, setLabelClipPath] = useState('');
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);

  // Add tree-related state from Select.tsx
  const [items, setItems] = useState<T.Option[]>([]);
  const ids = useMemo(() => H.mapById(props.options), [props.options]);
  // Add basic selection state
  const [selected, setSelected] = useState<T.Id[]>(
    isMultiple ? (value as T.Id[]) : [value as T.Id]
  );

  const [optionsUpdated, setOptionsUpdated] = useState(0);
  const isErrorVisible = !isOpen && !!error;

  const triggerProps = useMemo(
    () => ({
      label,
      size,
      round,
      variant,
      ...props.triggerProps,
    }),
    [props.triggerProps, label, size, round, variant]
  );

  // Simplified isSelected check
  const isSelected = (id: T.Id) =>
    // @ts-ignore
    isMultiple ? (selected as T.Id[])?.includes(id) : selected === id;

  const isClickedInside = elem =>
    elem.closest(`.${S.root}`) || elem.closest(`.${S.options}`);

  const setNewItems = (newItems: T.Option[]) => {
    maxIndex.current = newItems.length - 1;
    setItems(newItems);
    setOptionsUpdated(optionsUpdated + 1);

    if (focusedItemIndex > maxIndex.current && maxIndex.current >= 0) {
      setFocusedItemIndex(maxIndex.current);
      focusedItemId.current = newItems[maxIndex.current]?.id;
    }
  };

  const setItemFocus = index => {
    console.log('setItemFocus::', index);
    focusedItemId.current = items[index]?.id;
    setFocusedItemIndex(index);
  };

  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchChange = (e, value: string) => {
    setSearchVal(value);
    setIsSearchActive(true);
    onSearchChange?.(value);
    setNewItems(options.filter(filterOption));
  };

  const selectAll = () => {
    const newValue = options.map(({ id }) => id);

    setSelected(newValue);
    onChange?.(newValue);
  };

  const dropSelected = () => {
    setSelected([]);
    onChange?.([]);
  };

  const onFocusedElemRef = elem => {
    focusedElem.current = elem;

    if (elem) {
      const content = contentRef.current;

      if (!content) return;

      const { top, bottom } = elem.getBoundingClientRect();
      const rect = contentRef.current.getBoundingClientRect();
      const list = scrollInnerRef.current;

      if (top < rect.top) {
        list.scrollTop -= rect.top - top;
      } else if (bottom > rect.bottom) {
        list.scrollTop += bottom - rect.bottom;
      }
    }
  };

  const onPopupOpen = () => {
    setIsOpen(true);

    if (focusedItemIndex === -1) {
      setItemFocus(0);
    }
  };

  const onPopupClose = () => {
    setIsOpen(false);
    setSearchVal('');
    setIsSearchActive(false);
    setItemFocus(0);
  };

  const onFocus = () => {
    setIsFocused(true);
  };

  const onBlur = () => {
    setIsFocused(false);
  };

  const onOptionHover = useThrottle(
    id => {
      const mode = getInteractionMode();
      if (mode !== INTERACTION_MODE.POINTER) return;

      const index = items.findIndex(item => item.id === id);
      setItemFocus(index);
    },
    100,
    { trailing: true }
  );

  const onItemToggle = (id: T.Id) => {
    if (isMultiple) {
      const newValue = isSelected(id)
        ? (selected as T.Id[]).filter(i => i !== id)
        : [...(selected as T.Id[]), id];

      setSelected(newValue);
      onChange?.(newValue);
    } else {
      // mono select
      const newValue = isSelected(id) ? null : id;
      const newSelected = isSelected(id) ? [] : [id];

      setSelected(newSelected);
      onChange?.(newValue);
    }

    setSearchVal('');

    if (closeOnSelect) setIsOpen(false);
  };

  const getLabel = (id: T.Id) => ids.items[id]?.label || '';

  const getFieldLabel = (label: string) => {
    if (disableLabel) return null;

    // @ts-ignore
    const length = value?.length;

    if (isMultiple && length && showSelectedCount)
      return `${label} (${length})`;

    return label;
  };

  const filterOption = ({ label }) => {
    return label.toLowerCase().includes(searchValLower.current);
  };

  const selectedLabel = useMemo(() => {
    if (!isMultiple) return getLabel(value as T.Id);
    if (!value) return '';
    return (
      value
        // @ts-ignore
        .reduce((acc, id) => {
          const label = getLabel(id);
          return label ? [...acc, label] : acc;
        }, [] as string[])
        .join(', ')
    );
  }, [isMultiple, value, ids]);
  // console.log('selectedLabel::', selectedLabel);

  const triggerArrow = useMemo(() => {
    if (disableTriggerArrow || (inputProps?.hasClear && searchVal)) return null;

    return (
      <Icon
        type="chevronDown"
        className={cn(S.triggerArrow, isOpen && S.isOpen)}
        size={size}
      />
    );
  }, [isOpen, searchVal]);

  const renderTriggerInput = () => {
    return (
      <Input
        {...triggerProps}
        {...inputProps}
        // TODO: autoComplete
        addonRight={triggerArrow}
        error={isErrorVisible}
        value={isFocused && isSearchActive ? searchVal : selectedLabel}
        onChange={handleSearchChange}
        label={getFieldLabel(label)}
      />
    );
  };

  const renderAdditionalLabel = () => {
    return null;
  };

  const renderTriggerButton = () => {
    const { label, className, ...rest } = triggerProps;
    const props = omit(rest, ['name', 'inputProps']);
    const fullSelectedLabel = [selectedLabel, renderAdditionalLabel()].filter(
      Boolean
    );
    const hasSelected = fullSelectedLabel.length > 0;
    const displayLabel = hasSelected ? fullSelectedLabel : label;
    const title = hasSelected ? fullSelectedLabel : null;
    const isError = isErrorVisible;
    const classes = cn(
      S.triggerButton,
      isError && S.isError,
      triggerArrow && S.hasTriggerArrow,
      className
    );

    return (
      <div>
        <Button
          className={classes}
          variant="default"
          {...props}
          style={{ clipPath: labelClipPath }}
          title={title?.join?.(', ')}
        >
          <div
            className={cn(S.triggerButtonLabel, hasSelected && S.hasSelected)}
          >
            {displayLabel}
          </div>
          {triggerArrow}
        </Button>
        <Label
          size={size}
          isOnTop={hasSelected}
          isError={isError}
          onClipPathChange={setLabelClipPath}
        >
          {getFieldLabel(label)}
        </Label>
      </div>
    );
  };

  const renderTrigger = () => {
    if (trigger) return trigger;

    const triggerElem = isSearchable
      ? renderTriggerInput()
      : renderTriggerButton();

    return (
      <div className={S.trigger}>
        {triggerElem}
        {required && !hideRequiredStar && <RequiredStar size={size} />}
      </div>
    );
  };

  const renderPresets = () => {
    const items = presets.map(({ label, ids }) => ({
      children: label,
      onClick: () => setSelected(ids),
      key: label,
    })) as T.PresetButtonProps[];

    if (selectAllButton) {
      items.push({
        children: 'Select all',
        onClick: selectAll,
        key: 'select-all-button',
      });
    }

    if (clearButton) {
      items.push({
        children: 'Clear',
        onClick: dropSelected,
        key: 'clear-button',
      });
    }

    if (items.length === 0) return null;

    return (
      <div className={S.presetPanel} key="preset-panel">
        {items.map(props => (
          <Button className={S.presetButton} variant="clear" {...props} />
        ))}
      </div>
    );
  };

  const renderOption = (item: T.Option, level = 0) => {
    const { id, isGroupHeader } = item;

    const isFocused = id === focusedItemId.current;
    const isSelected = selected.includes(id);
    const items = [] as JSX.Element[];

    const className = cn(
      S.option,
      isGroupHeader && S.isGroup,
      isFocused && S.isFocused,
      isSelected && S.isSelected,
      S[`level-${level}`],
      optionClassName
    );
    const optionProps = {
      className,
      onPointerUp: () => onItemToggle(id),
      onPointerEnter: () => onOptionHover(id),
    } as T.OptionElemProps;

    // @ts-ignore
    if (isFocused) optionProps.ref = onFocusedElemRef;

    if (isSelected && !isFirstSelectedMeet.current) {
      isFirstSelectedMeet.current = true;
    }

    if (filterOption(item)) {
      items.unshift(
        <div key={id} {...optionProps}>
          {H.renderLabel(item)}
        </div>
      );
    }

    return items;
  };

  const renderOptions = () => {
    isFirstSelectedMeet.current = false;

    return [...additionalOptions, ...items]
      .map(item => renderOption(item))
      .flat();
  };

  useEffect(() => {
    const items = additionalOptions?.length
      ? [...additionalOptions, ...options]
      : options;

    setNewItems(items);
  }, [options]);

  useEffect(() => {
    const searchVal = props.searchValue;

    if (searchVal) setSearchVal(searchVal);
  }, [props.searchValue]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const currIndex = focusedItemIndex;

      if (e.key === 'ArrowUp') {
        if (currIndex > 0) setItemFocus(currIndex - 1);
      }

      if (e.key === 'ArrowDown') {
        if (currIndex < maxIndex.current) setItemFocus(currIndex + 1);
      }

      if (currIndex === -1 || !isOpen) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        onItemToggle(items[currIndex].id);
      }
    },
    [items, focusedItemIndex, isOpen]
  );

  useEvent({
    event: 'keydown',
    isActive: isOpen,
    callback: onKeyDown,
  });

  useEvent({
    event: 'click',
    // isActive: isMultiple,
    callback: e => {
      if (!isClickedInside(e.target)) {
        setIsOpen(false);
      }
    },
  });

  const optionsList = useMemo(
    () => (
      <div ref={contentRef}>
        {renderPresets()}
        <Scroll
          y
          {...scrollProps}
          offset={{ y: { before: 10, after: 10 } }}
          className={cn(S.options, S[`size-${size}`], scrollProps?.className)}
          onInnerRef={elem => (scrollInnerRef.current = elem)}
          key="items-scroll"
        >
          {renderOptions()}
        </Scroll>
      </div>
    ),
    [items, searchVal, focusedItemIndex]
  );

  const classes = cn(S.root, className, S[`size-${size}`]);

  return (
    <>
      <Popup
        className={classes}
        direction="bottom"
        size={size}
        focusControl
        hoverControl={isFocused}
        blur={blur}
        isOpen={isOpen}
        disabled={disabled}
        {...popupProps}
        onOpen={onPopupOpen}
        onClose={onPopupClose}
        trigger={renderTrigger()}
        triggerProps={{
          onFocus: onFocus,
          onBlur: onBlur,
        }}
        content={optionsList}
      />
      {isErrorVisible && (
        <AssistiveText variant="danger" size={size}>
          {error as string}
        </AssistiveText>
      )}
    </>
  );
}
