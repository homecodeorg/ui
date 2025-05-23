import * as T from './Autocomplete.types';

import { Input, Menu, Popup } from 'uilib/components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import S from './Autocomplete.styl';
import { Shimmer } from 'uilib/components/Shimmer/Shimmer';
import { Size } from 'uilib/types';
import cn from 'classnames';
import debounce from 'uilib/tools/debounce';
import { useIsMounted } from 'uilib/hooks/useIsMounted';
import { useListKeyboardControl } from 'uilib/hooks/useListKeyboardControl';

export function Autocomplete(props: T.Props) {
  const {
    className,
    inputWrapperClassName,
    value,
    onChange,
    size = 'm' as Size,
    getOptions,
    onSelect,
    debounceDelay = 300,
    round = false,
    blur = false,
    inputProps = {},
    popupProps = {},
    menuProps = {},
  } = props;

  const isMounted = useIsMounted();
  const [options, setOptions] = useState<T.Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const isOpen = options.length > 0;
  const classes = cn(S.root, className, popupProps.className);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    inputProps?.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = false;
    inputProps?.onBlur?.(e);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const val = (value || e?.target.value) ?? '';
    setOptions([]);
    setSearchValue(val);
    onChange(e, val);
    fetchOptions(val);
    return true;
  };

  const handleSelect = (option: T.Option) => {
    setSearchValue(option.label);
    setOptions([]);
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
    itemsCount: options.length,
    onSelect: index => handleSelect(options[index]),
  });

  const fetchOptions = debounce(async (inputValue: string) => {
    if (!inputValue) {
      setOptions([]);
      return;
    }

    currentRequest.current = inputValue;
    setIsLoading(true);

    try {
      const newOptions = await getOptions(inputValue);

      if (!isMounted.current) return;
      if (currentRequest.current !== inputValue) return;

      setOptions(newOptions);
    } catch (error) {
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, debounceDelay);

  useEffect(() => {
    setSearchValue(value);
    setOptions([]);
    if (isFocusedRef.current) fetchOptions(value);
  }, [value]);

  const optionsList = useMemo(() => {
    if (!options.length) return null;

    return (
      <Menu
        className={S.options}
        size={size}
        offset={{ y: { before: 20, after: 20 } }}
        {...menuProps}
      >
        {options.map((option, index) => (
          <Menu.Item
            key={option.id}
            focused={focusedIndex === index}
            className={S.option}
            onClick={() => handleSelect(option)}
            onMouseEnter={() => setFocusedIndex(index)}
          >
            {option.render ? option.render(option) : option.label}
          </Menu.Item>
        ))}
      </Menu>
    );
  }, [options, focusedIndex]);

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
