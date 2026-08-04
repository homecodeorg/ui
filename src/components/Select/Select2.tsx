import * as H from './Select.helpers';
import * as T from './Select.types';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { INTERACTION_MODE, getInteractionMode } from 'uilib/tools/dom';

import cn from 'classnames';
import { omit } from 'uilib/tools/object';

import { AssistiveText } from '../AssistiveText/AssistiveText';
import { Button } from '../Button/Button';
import { Chip } from '../Chip/Chip';
import { Input } from '../Input/Input';
import { Icon } from '../Icon/Icon';
import { Label } from '../Label/Label';
import { Popup } from '../Popup/Popup';
import { RequiredStar } from '../RequiredStar/RequiredStar';
import { Scroll } from '../Scroll/Scroll';
import { useThrottle } from 'uilib/hooks/useThrottle';
import useEvent from 'uilib/hooks/useEvent';
import { generateUID } from 'uilib/tools/uid';

import {
  useKeyboardNav,
  useSelectOpenState,
  useSelectOptions,
  useSelectedIds,
} from './Select.hooks';

import S from './Select.styl';

/** Time given to a pointer press inside the popup before a blur closes it. */
const BLUR_CLOSE_DELAY = 60;
const POINTER_PRESS_TTL = 100;

export function Select2(props: T.Props) {
  const {
    className,
    value,
    onChange,
    onChipClick,
    onSearchChange,
    disableTriggerArrow,
    inputProps,
    popupProps,
    scrollProps,
    size = 'm',
    round,
    optionsClassName,
    optionClassName,
    selectedChipClassName,
    additionalOptions = [],
    options = [],
    variant,
    label,
    additionalLabel,
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
    selectedChipRemoveTooltip,
    selectedChipIds,
    onOpen,
    onClose,
    onFocus,
    onBlur,
  } = props;

  const isMultiple = H.isMultiple(value);
  const closeOnSelect = props.closeOnSelect ?? !isMultiple;

  const instanceId = useRef(generateUID());
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollInnerRef = useRef<HTMLDivElement>(null);
  const pointerPressedInside = useRef(false);
  const pointerPressTimer = useRef(0);
  const blurTimer = useRef(0);

  const [labelClipPath, setLabelClipPath] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [innerSearchVal, setInnerSearchVal] = useState('');

  const searchVal = props.searchValue ?? innerSearchVal;
  const searchQuery = isSearching ? searchVal : '';

  const { selectedIds, setSelectedIds } = useSelectedIds(value);
  const { allOptions, visibleOptions, navigableOptions, optionsById } =
    useSelectOptions({
      options,
      additionalOptions,
      searchQuery,
    });

  const handleOpen = useCallback(() => {
    popupProps?.onOpen?.();
    onOpen?.();
  }, [popupProps?.onOpen, onOpen]);

  const handleClose = useCallback(() => {
    popupProps?.onClose?.();
    onClose?.();
  }, [popupProps?.onClose, onClose]);

  const { isOpen, open, close } = useSelectOpenState({
    isOpen: props.isOpen,
    onOpen: handleOpen,
    onClose: handleClose,
  });

  const isErrorVisible = !isOpen && !!error;
  const hasChips = isMultiple && selectedIds.length > 0;

  const isSelected = (id: T.Id) => selectedIds.includes(id);
  const getLabel = (id: T.Id) => optionsById.items[id]?.label || '';

  const isInsideSelect = (elem: EventTarget | null) =>
    elem instanceof Element &&
    Boolean(elem.closest(`[data-select-id="${instanceId.current}"]`));

  const openIfEnabled = () => {
    if (disabled) return;
    open();
  };

  const resetSearch = () => {
    setIsSearching(false);
    setInnerSearchVal('');
    if (searchVal) onSearchChange?.('');
  };

  const applySelection = (ids: T.Id[], nextValue: T.Value) => {
    setSelectedIds(ids);
    onChange?.(nextValue);
  };

  const onItemToggle = (id: T.Id) => {
    if (!H.isSelectable(optionsById.items[id])) return;

    if (isMultiple) {
      const ids = isSelected(id)
        ? selectedIds.filter(i => i !== id)
        : [...selectedIds, id];

      applySelection(ids, ids);
    } else {
      const nextValue = isSelected(id) ? null : id;

      applySelection(nextValue === null ? [] : [id], nextValue);
    }

    resetSearch();

    if (closeOnSelect) close();
  };

  const selectAll = () => {
    const ids = allOptions.filter(H.isSelectable).map(({ id }) => id);

    applySelection(ids, isMultiple ? ids : (ids[0] ?? null));
  };

  const dropSelected = () => applySelection([], isMultiple ? [] : null);

  const applyPreset = (ids: T.Id[]) =>
    applySelection(ids, isMultiple ? ids : (ids[0] ?? null));

  const { focusedId, setFocusedId } = useKeyboardNav({
    isOpen,
    navigableOptions,
    selectedIds,
    onSelect: onItemToggle,
  });

  const onOptionHover = useThrottle(
    (id: T.Id) => {
      if (getInteractionMode() !== INTERACTION_MODE.POINTER) return;
      setFocusedId(id);
    },
    100,
    { trailing: true }
  );

  const onScrollInnerRef = useCallback((elem: HTMLDivElement) => {
    scrollInnerRef.current = elem;
  }, []);

  const onFocusedElemRef = (elem: HTMLDivElement | null) => {
    const content = contentRef.current;
    const list = scrollInnerRef.current;

    if (!elem || !content || !list) return;

    const { top, bottom } = elem.getBoundingClientRect();
    const rect = content.getBoundingClientRect();

    if (top < rect.top) {
      list.scrollTop -= rect.top - top;
    } else if (bottom > rect.bottom) {
      list.scrollTop += bottom - rect.bottom;
    }
  };

  const handleSearchChange = (e, val: string) => {
    setIsSearching(true);
    setInnerSearchVal(val);
    onSearchChange?.(val);
    openIfEnabled();
  };

  const handleFocus = e => {
    window.clearTimeout(blurTimer.current);
    onFocus?.(e);
  };

  /**
   * Popup skips its own blur-close while it is controlled, so closing on blur is
   * up to Select. A press inside the popup blurs the trigger too — that one must
   * not close the list.
   */
  const handleBlur = e => {
    onBlur?.(e);

    window.clearTimeout(blurTimer.current);
    blurTimer.current = window.setTimeout(() => {
      if (pointerPressedInside.current) return;
      close();
    }, BLUR_CLOSE_DELAY);
  };

  const onTriggerPointerDown = () => {
    if (disabled) return;
    // A searchable trigger is a text field: pressing it must never close.
    if (isOpen && !isSearchable) close();
    else open();
  };

  useEvent({
    event: 'pointerdown',
    isCapture: true,
    callback: e => {
      window.clearTimeout(pointerPressTimer.current);
      pointerPressedInside.current = isInsideSelect(e.target);
      pointerPressTimer.current = window.setTimeout(
        () => (pointerPressedInside.current = false),
        POINTER_PRESS_TTL
      );
    },
  });

  useEvent({
    event: 'click',
    isActive: isOpen,
    callback: e => {
      if (!isInsideSelect(e.target)) close();
    },
  });

  useEffect(() => {
    if (!isOpen) resetSearch();
  }, [isOpen]);

  useEffect(() => {
    if (props.searchValue === undefined) return;
    setIsSearching(props.searchValue !== '');
  }, [props.searchValue]);

  useEffect(
    () => () => {
      window.clearTimeout(blurTimer.current);
      window.clearTimeout(pointerPressTimer.current);
    },
    []
  );

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

  const getFieldLabel = (label: string) => {
    if (disableLabel) return null;
    if (isMultiple && selectedIds.length && showSelectedCount)
      return `${label} (${selectedIds.length})`;

    return label;
  };

  const selectedLabel = useMemo(
    () =>
      selectedIds
        .map(getLabel)
        .filter(Boolean)
        .join(', '),
    [selectedIds, optionsById]
  );

  const triggerArrow = useMemo(() => {
    if (disableTriggerArrow || (inputProps?.hasClear && searchVal)) return null;

    return (
      <Icon
        type="chevronDown"
        className={cn(S.triggerArrow, isOpen && S.isOpen)}
        size={size}
      />
    );
  }, [disableTriggerArrow, inputProps?.hasClear, searchVal, isOpen, size]);

  const renderSelectedChips = () =>
    selectedIds.map(id => {
      const label = getLabel(id);

      if (!label) return null;

      return (
        <Chip
          className={cn(
            S.chip,
            selectedChipIds?.includes(id) && selectedChipClassName,
            optionsById.items[id]?.chipClassName
          )}
          key={id}
          size={size}
          selected={selectedChipIds?.includes(id)}
          onRemove={() => onItemToggle(id)}
          onClick={() => onChipClick?.(id)}
          removeTooltip={selectedChipRemoveTooltip}
        >
          {label}
        </Chip>
      );
    });

  const renderTriggerInput = () => {
    const inputValue = isSearching ? searchVal : isMultiple ? '' : selectedLabel;

    return (
      <Input
        {...triggerProps}
        {...inputProps}
        // TODO: autoComplete
        addonRight={triggerArrow}
        error={isErrorVisible}
        value={inputValue}
        onChange={handleSearchChange}
        label={getFieldLabel(label)}
        placeholder={hasChips && !inputValue ? '' : inputProps?.placeholder}
      />
    );
  };

  const renderTriggerButton = () => {
    const { label, className, ...rest } = triggerProps;
    const buttonProps = omit(rest, ['name', 'inputProps']);
    const fullSelectedLabel = [selectedLabel, additionalLabel].filter(Boolean);
    const hasSelected = fullSelectedLabel.length > 0;
    const displayLabel = hasSelected ? fullSelectedLabel : label;
    const title = hasSelected && !isMultiple ? fullSelectedLabel : null;
    const classes = cn(
      S.triggerButton,
      isErrorVisible && S.isError,
      triggerArrow && S.hasTriggerArrow,
      className
    );

    return (
      <div>
        <Button
          className={classes}
          variant="default"
          {...buttonProps}
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

        {!isMultiple && (
          <Label
            size={size}
            isOnTop={hasSelected}
            isError={isErrorVisible}
            onClipPathChange={setLabelClipPath}
          >
            {getFieldLabel(label)}
          </Label>
        )}
      </div>
    );
  };

  const renderTrigger = () => {
    if (trigger) return trigger;

    const triggerElem = isSearchable
      ? renderTriggerInput()
      : renderTriggerButton();

    return (
      <div className={S.trigger} onPointerDown={onTriggerPointerDown}>
        {hasChips && (
          <Scroll
            y
            className={S.chipsContainer}
            innerClassName={S.chipContainerInner}
            size={size}
            fadeSize={size}
            autoHide
          >
            {renderSelectedChips()}
          </Scroll>
        )}
        {triggerElem}
        {required && !hideRequiredStar && <RequiredStar size={size} />}
      </div>
    );
  };

  const renderPresets = () => {
    const items = presets.map(({ label, ids }) => ({
      children: label,
      onClick: () => applyPreset(ids),
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
        {items.map(({ key, ...rest }) => (
          <Button
            className={S.presetButton}
            variant="clear"
            key={key}
            {...rest}
          />
        ))}
      </div>
    );
  };

  const renderOption = (item: T.Option, level = 0) => {
    const { id, isGroupHeader } = item;
    const optionProps: T.OptionElemProps = {
      className: cn(
        S.option,
        isGroupHeader && S.isGroup,
        id === focusedId && S.isFocused,
        isSelected(id) && S.isSelected,
        S[`level-${level}`],
        optionClassName
      ),
      onPointerUp: () => onItemToggle(id),
      onPointerEnter: () => onOptionHover(id),
    };

    if (id === focusedId) optionProps.ref = onFocusedElemRef;

    return (
      <div key={id} {...optionProps}>
        {H.renderLabel(item)}
      </div>
    );
  };

  const optionsList = (
    <div ref={contentRef} data-select-id={instanceId.current}>
      {renderPresets()}
      <Scroll
        y
        {...scrollProps}
        offset={{ y: { before: 10, after: 10 } }}
        className={cn(
          S.options,
          S[`size-${size}`],
          optionsClassName,
          scrollProps?.className
        )}
        onInnerRef={onScrollInnerRef}
        key="items-scroll"
      >
        {visibleOptions.map(item => renderOption(item))}
      </Scroll>
    </div>
  );

  const classes = cn(S.root, className, S[`size-${size}`]);

  return (
    <>
      <Popup
        className={classes}
        direction="bottom"
        size={size}
        focusControl
        blur={blur}
        round={round}
        disabled={disabled}
        {...popupProps}
        isOpen={isOpen}
        onOpen={openIfEnabled}
        onClose={close}
        trigger={renderTrigger()}
        triggerProps={{
          'data-select-id': instanceId.current,
          onFocus: handleFocus,
          onBlur: handleBlur,
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
