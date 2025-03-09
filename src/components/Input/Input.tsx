import {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  useMemo,
  forwardRef,
  MutableRefObject,
  ForwardedRef,
} from 'react';
import cn from 'classnames';
import omit from 'lodash.omit';

import { Label } from 'uilib/components/Label/Label';
import { RequiredStar } from 'uilib/components/RequiredStar/RequiredStar';
import { AssistiveText } from 'uilib/components/AssistiveText/AssistiveText';
import { Button } from 'uilib/components/Button/Button';
import { Icon } from 'uilib/components/Icon/Icon';
import { Scroll } from 'uilib/components/Scroll/Scroll';

import { capitalize } from 'uilib/tools/string';
import { generateUID } from 'uilib/tools/uid';

import S from './Input.styl';
import * as T from './Input.types';
import { debounce } from 'uilib';

const TEXTAREA_SCROLL_TOP_OFFSET = {
  s: 30,
  m: 40,
  l: 50,
};

export type InputProps = T.Props;

type InputValue = string | number;

export const Input = forwardRef<HTMLInputElement, T.Props>(
  (props, ref: ForwardedRef<HTMLInputElement>) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const setRef = (element: HTMLInputElement) => {
      inputRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const {
      type = 'text',
      size = 'm',
      variant = 'default',
      value,
      defaultValue = '',
      onChange,
      onFocus,
      onBlur,
      onClear,
      onInput,
      changeOnEnd,
      checkAutofill,
      hasClear,
      required,
      hideRequiredStar,
      disabled,
      error,
      label,
      placeholder,
      addonLeft,
      addonRight,
      forceLabelOnTop,
      scrollProps,
      step = 1,
      round,
      className,
    } = props;

    const updateAutoComplete = () => {
      const form = inputRef.current?.closest('form');
      const val = form?.getAttribute('autocomplete');

      if (autoComplete !== val) setAutoComplete(val);
    };

    const updateSelection = () => {
      const { type } = props;
      const elem = inputRef.current;

      if (!isFocused || !elem || type !== 'text') return;

      elem.selectionStart = cursorPos.current;
      elem.selectionEnd = cursorPos.current;
    };

    const isFocusedRef = useRef(false);
    const [isFocused, _setIsFocused] = useState(false);
    const setIsFocused = (val: boolean) => {
      isFocusedRef.current = val;
      _setIsFocused(val);
    };
    const [inputValue, setInputValue] = useState<InputValue>(
      (value ?? defaultValue ?? '') as InputValue
    );
    const [labelClipPath, setLabelClipPath] = useState('');
    const [autoComplete, setAutoComplete] = useState('');
    const uid = generateUID();

    const isTextArea = type === 'textarea';
    const isNumber = type === 'number';
    const hasValue = isNumber || Boolean(value || inputValue || defaultValue);
    const isLabelOnTop =
      forceLabelOnTop || Boolean(addonLeft) || hasValue || isFocused;

    const cursorPos = useRef(0);

    const getValue = (val = inputValue): InputValue => {
      if (type === 'number') {
        if (val) return parseFloat(val as string);
        return 0;
      }

      if (isTextArea) return inputRef.current.innerText.replace(/\n/g, '');

      return val;
    };

    const onTextareaPaste = e => {
      if (!isFocusedRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      pasteToTextarea(e.clipboardData.getData('text/plain'));
    };

    const setTextareaValue = (value: string) => {
      // @ts-ignore
      if (inputRef.current) inputRef.current.innerText = value;
    };

    const pasteToTextarea = debounce((text: string) => {
      const sel = window.getSelection();
      const textarea = inputRef.current;
      const prevText = textarea.innerText;
      const startPos = sel.getRangeAt(0).startOffset;
      const nextText =
        prevText.substring(0, startPos) + text + prevText.substring(startPos);

      textarea.innerText = nextText;
      onChangeValue(nextText);

      setTimeout(() => {
        try {
          window
            .getSelection()
            .setPosition(textarea.firstChild, startPos + text.length);
        } catch (e) {}
      }, 100);
    }, 100);

    const onClearPress = e => {
      e.preventDefault();
      e.stopPropagation();

      onClear?.();

      if (isTextArea) {
        inputRef.current.innerText = '';
      }

      if (onChange) {
        onChangeValue('');
      } else {
        if (!isTextArea) {
          inputRef.current.value = '';
        }
      }

      inputRef.current?.focus();
    };

    const onDocKeyUp = (e: KeyboardEvent) => {
      const { changeOnEnd } = props;

      if (changeOnEnd && e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        onTypingEnd();
      }

      if (isFocused && e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        inputRef.current?.blur();
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = getValue(e.target.value);

      onChangeValue(val, e);
    };

    const onChangeValue = (
      value: InputValue,
      e?: ChangeEvent<HTMLInputElement>
    ) => {
      if (!isNumber && inputRef.current) {
        cursorPos.current = inputRef.current.selectionStart;
      }

      setInputValue(value);
      onChange?.(e, value);
    };

    const onNumberWheel = delta => {
      const value = (getValue() as number) + step * delta;

      onChangeValue(value);
      onChange?.(null, value);
    };

    const onTextAreaInput = e => {
      setInputValue(e.target.innerText);
      handleChange(e);
      onInput?.(e);
    };

    const onLabelClipPathChange = (clipPath: string) =>
      setLabelClipPath(clipPath);

    const onTypingEnd = () => {
      onChange?.(null, getValue());
    };

    const handleFocus = e => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = e => {
      if (changeOnEnd) onTypingEnd();

      const val = getValue(e?.target?.value);

      setIsFocused(false);
      if (checkAutofill && onChange && !value && val)
        onChange(null, val as T.Value);

      if (onBlur) onBlur(e);
    };

    const controlProps = useMemo((): T.ControlProps => {
      const controlProps = {
        type,
        value: inputValue,
        step,
        required,
        disabled,
        ...props.controlProps,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
      };

      if (isTextArea) {
        controlProps.contentEditable = true;
        controlProps.onInput = onTextAreaInput;
      }

      if (placeholder && !inputValue && (!label || isLabelOnTop)) {
        controlProps.placeholder = placeholder;
      }

      if (!autoComplete) {
        controlProps.suppressHydrationWarning = true;
        controlProps.autoComplete = uid;
        delete controlProps.name;
      }

      if (controlProps.value === undefined) controlProps.value = ' ';

      return controlProps;
    }, [
      type,
      size,
      variant,
      inputValue,
      defaultValue,
      step,
      required,
      disabled,
      props.controlProps,
      handleChange,
      onFocus,
      onBlur,
      isTextArea,
      onTextAreaInput,
      placeholder,
      label,
      isLabelOnTop,
      autoComplete,
      uid,
    ]);

    const wrapControl = control => {
      if (isTextArea) {
        const { size } = props;

        return (
          <Scroll
            y
            size={size}
            fadeSize="s"
            className={cn(S.scroller, S.controlWrapper, scrollProps?.className)}
            offset={{
              y: { before: TEXTAREA_SCROLL_TOP_OFFSET[size], after: 20 },
            }}
            {...scrollProps}
            innerProps={{
              suppressHydrationWarning: true,
              style: { clipPath: labelClipPath },
            }}
            key="scroller"
          >
            {control}
          </Scroll>
        );
      }

      return <div className={S.controlWrapper}>{control}</div>;
    };

    const renderAddon = (type: 'right' | 'left') => {
      const name = `addon${capitalize(type)}`;
      const content = props[name];

      if (!content) return null;

      const addonProps = {
        className: cn(S[name], props[`${name}ClassName`]),
        key: name,
      };
      const isString = typeof content === 'string';
      const elem = isString ? <span>{content}</span> : content;

      // @ts-ignore
      if (isString) addonProps.title = content;

      return <div {...addonProps}>{elem}</div>;
    };

    useEffect(() => {
      document.addEventListener('keydown', onDocKeyUp);
      if (isTextArea) {
        inputRef.current?.addEventListener('paste', onTextareaPaste);
      }

      return () => {
        document.removeEventListener('keydown', onDocKeyUp);
        inputRef.current?.removeEventListener('paste', onTextareaPaste);
      };
    }, [isTextArea]);

    useEffect(() => {
      updateSelection();
      updateAutoComplete();

      if (value !== inputValue) {
        setInputValue(value);
        // setTextareaValue(String(value));
      }
    }, [value]);

    useEffect(() => {
      if (isTextArea) setTextareaValue(String(value));
    }, []);

    const Control = isTextArea ? 'span' : 'input';

    const classes = cn(
      S.root,
      isTextArea && S.isTextArea,
      S[`size-${size}`],
      S[`variant-${variant}`],
      isFocused && S.isFocused,
      error && S.hasError,
      hasClear && S.hasClear,
      disabled && S.isDisabled,
      round && S.round,
      className
    );

    return (
      <div className={classes} title={String(value)}>
        <label className={S.main} key="main">
          <div
            className={S.border}
            suppressHydrationWarning
            style={{ clipPath: labelClipPath }}
            key="border"
          />
          {renderAddon('left')}
          {wrapControl(
            <>
              <Control
                {...controlProps}
                className={cn(S.control, controlProps?.className)}
                ref={setRef}
                key="control"
              />
              {isTextArea &&
                controlProps.placeholder &&
                !controlProps.value && (
                  <span className={S.placeholder} spellCheck={false}>
                    {controlProps.placeholder}
                  </span>
                )}
            </>
          )}
          {isNumber && (
            <div className={S.numberArrows}>
              <Button
                variant="clear"
                onClick={() => onNumberWheel(1)}
                tabIndex={-1}
              >
                <Icon type="chevronUp" size={size} />
              </Button>
              <Button
                variant="clear"
                onClick={() => onNumberWheel(-1)}
                tabIndex={-1}
              >
                <Icon type="chevronDown" size={size} />
              </Button>
            </div>
          )}

          <Label
            className={cn(S.label, addonRight && S.hasAddonRight)}
            size={size}
            isOnTop={isLabelOnTop}
            isError={Boolean(error)}
            onClipPathChange={onLabelClipPathChange}
            key="label"
          >
            {label}
          </Label>
          {renderAddon('right')}
          {required && !hideRequiredStar && (
            <RequiredStar size={size} key="required-star" />
          )}
        </label>

        {hasClear && !disabled && hasValue && (
          <Button
            className={S.clearButton}
            variant="clear"
            size={size}
            square
            onClick={onClearPress}
            title=""
            key="clear"
          >
            <Icon className={S.clearIcon} size={size} type="close" />
          </Button>
        )}
        {!disabled && typeof error === 'string' && (
          <AssistiveText variant="danger" size={size} key="assistive-text">
            {error}
          </AssistiveText>
        )}
      </div>
    );
  }
);
