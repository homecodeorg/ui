import { Component, createRef, ChangeEvent, useEffect, Fragment } from 'react';
import cn from 'classnames';
import { createStore } from 'justorm/react';
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

export class Input extends Component<T.Props> {
  inputRef = createRef<HTMLInputElement>();

  isClearPressed = false;
  cursorPos = 0;
  prevLabelText = '';
  store: any;
  uid = generateUID();

  static defaultProps = {
    type: 'text',
    size: 'm',
    variant: 'default',
  };

  constructor(props: T.Props) {
    super(props);

    const inputValue = props.value ?? props.defaultValue ?? '';
    const hasValue = this.hasValue(inputValue);

    this.store = createStore(this, {
      isFocused: false,
      isLabelOnTop: this.isLabelOnTop(hasValue),
      inputValue,
      hasValue,
      labelClipPath: '',
      autoComplete: null,
    });
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onDocKeyUp, true);

    if (this.isTextArea()) {
      this.inputRef.current.innerText = this.store.inputValue;
      document.addEventListener('paste', this.onTextareaPaste, true);
    }
  }

  componentDidUpdate(prevProps: T.Props) {
    const { value } = this.props;

    this.updateSelection();
    this.updateAutoComplete();

    if (value !== prevProps.value && value !== this.store.inputValue) {
      this.store.inputValue = value;
      // @ts-ignore
      if (this.isTextArea()) this.inputRef.current.innerText = value;
      this.updateHasValue();
      this.updateLabelPosition();
    }
  }

  updateAutoComplete() {
    const form = this.inputRef.current?.closest('form');
    const val = form?.getAttribute('autocomplete');

    if (this.store.autoComplete !== val) this.store.autoComplete = val;
  }

  updateSelection() {
    const { type } = this.props;
    const { isFocused } = this.store;
    const elem = this.inputRef.current;

    if (!isFocused || !elem || type !== 'text') return;

    elem.selectionStart = this.cursorPos;
    elem.selectionEnd = this.cursorPos;
  }

  updateLabelPosition() {
    this.store.isLabelOnTop = this.isLabelOnTop();
  }

  updateHasValue() {
    this.store.hasValue = this.hasValue();
  }

  hasValue(value = this.store.inputValue) {
    const { type, defaultValue } = this.props;

    return type === 'number' || Boolean(value || defaultValue);
  }

  isTextArea = () => this.props.type === 'textarea';
  isNumber = () => this.props.type === 'number';

  isLabelOnTop(hasValue = this.store?.hasValue) {
    const { forceLabelOnTop, addonLeft } = this.props;

    return (
      forceLabelOnTop || Boolean(addonLeft) || hasValue || this.store?.isFocused
    );
  }

  getValue(val = this.store.inputValue) {
    const { type } = this.props;

    if (type === 'number') {
      if (val) return parseFloat(val);
      return 0;
    }

    if (this.isTextArea())
      return this.inputRef.current.innerText.replace('/n', '');

    return val;
  }

  onTextareaPaste = e => {
    if (!this.store.isFocused) return;

    e.preventDefault();
    e.stopPropagation();

    this.pasteToTextarea(e.clipboardData.getData('text/plain'));
  };

  pasteToTextarea = debounce((text: string) => {
    console.log('onTextareaPaste');

    const sel = window.getSelection();
    const textarea = this.inputRef.current;
    const prevText = textarea.innerText;
    // @ts-ignore
    const startPos = sel.extentOffset;
    const nextText =
      prevText.substring(0, startPos) + text + prevText.substring(startPos);

    textarea.innerText = nextText;

    sel.setPosition(textarea.firstChild, startPos + text.length);
  }, 100);

  onClearPress = e => {
    const { onChange, onClear } = this.props;
    const isTextArea = this.isTextArea();

    e.preventDefault();
    e.stopPropagation();

    onClear?.();

    if (this.isTextArea()) {
      this.inputRef.current.innerText = '';
    }

    if (onChange) {
      this.onChange('');
    } else {
      if (!this.isTextArea) {
        this.inputRef.current.value = '';
      }
    }

    this.inputRef.current?.focus();
  };

  onDocKeyUp = (e: KeyboardEvent) => {
    const { changeOnEnd } = this.props;
    const { isFocused } = this.store;

    if (changeOnEnd && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.onTypingEnd();
    }

    if (isFocused && e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.inputRef.current?.blur();
    }
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = this.getValue(e.target.value);

    this.onChange(value, e);
  };

  onChange = (value: string, e?: ChangeEvent<HTMLInputElement>) => {
    const { onChange, changeOnEnd, type } = this.props;
    const isNumber = type === 'number';

    if (!isNumber) this.cursorPos = this.inputRef.current.selectionStart;

    if (changeOnEnd) {
      this.store.inputValue = value;
      this.updateHasValue();
    } else if (onChange) {
      onChange(e, value);
    } else {
      this.store.inputValue = value;
    }
  };

  onNumberWheel = delta => {
    const { onChange, step = 1 } = this.props;
    const value = this.getValue() + step * delta;

    this.onChange(value);
    onChange?.(null, value);
  };

  onTextAreaInput = e => {
    const { onInput } = this.props;

    this.store.inputValue = e.target.innerText;
    this.updateHasValue();
    this.handleChange(e);
    onInput?.(e);
  };

  onLabelClipPathChange = (clipPath: string) =>
    (this.store.labelClipPath = clipPath);

  onTypingEnd = () => {
    const { onChange } = this.props;
    onChange?.(null, this.getValue());
  };

  onFocus = e => {
    const { onFocus } = this.props;

    this.store.isFocused = true;
    this.updateLabelPosition();
    onFocus?.(e);
  };

  onBlur = e => {
    if (this.props.changeOnEnd) this.onTypingEnd();
    if (this.isClearPressed) {
      e.preventDefault();
      return;
    }

    // @ts-ignore
    const val = this.getValue(e?.target?.value);
    const { onBlur, onChange, value, checkAutofill } = this.props;

    this.store.isFocused = false;
    this.updateLabelPosition();
    // some browsers not fire `onchange` after autofill
    if (checkAutofill && onChange && !value && val) onChange(null, val);
    if (onBlur) onBlur(e);
  };

  getControlProps(): T.ControlProps {
    const { value, label, controlProps, placeholder, ...rest } = this.props;
    const { autoComplete, isLabelOnTop, inputValue } = this.store;

    const props = {
      ...omit(rest, [
        'className',
        'clear',
        'onClear',
        'hasClear',
        // 'required',
        'hideRequiredStar',
        'size',
        'error',
        'checkAutofill',
        'addonLeft',
        'addonRight',
        'forceLabelOnTop',
        'changeOnEnd',
        'scrollProps',
      ]),
      value: inputValue,
      ...controlProps,
      onChange: this.handleChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    };

    if (this.isTextArea()) {
      props.contentEditable = true;
      props.onInput = this.onTextAreaInput;
    }

    if (placeholder && !value && (!label || isLabelOnTop)) {
      props.placeholder = placeholder;
    }

    if (!autoComplete) {
      props.suppressHydrationWarning = true;
      props.autoComplete = this.uid;
      delete props.name;
    }

    if (props.value === undefined) props.value = ' ';

    return props;
  }

  wrapControll(control) {
    if (this.isTextArea()) {
      const { size, scrollProps } = this.props;
      const { labelClipPath } = this.store;

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
  }

  renderAddon(type: 'right' | 'left') {
    const name = `addon${capitalize(type)}`;
    const content = this.props[name];

    if (!content) return null;

    const props = {
      // @ts-ignore
      className: cn(S[name], this.props[`${name}ClassName`]),
      key: name,
    };
    const isString = typeof content === 'string';
    const elem = isString ? <span>{content}</span> : content;

    // @ts-ignore
    if (isString) props.title = content;

    return <div {...props}>{elem}</div>;
  }

  render() {
    const {
      className,
      size,
      label,
      value,
      variant,
      error,
      hasClear,
      round,
      required,
      hideRequiredStar,
      disabled,
      addonRight,
    } = this.props;
    const { isFocused, hasValue, labelClipPath, isLabelOnTop } = this.store;
    const isNumber = this.isNumber();
    const isTextArea = this.isTextArea();

    const Control = isTextArea ? 'span' : 'input';
    const controlProps = this.getControlProps();
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
      // @ts-ignore
      <div className={classes} title={value}>
        <label className={S.main} key="main">
          <div
            className={S.border}
            suppressHydrationWarning
            style={{ clipPath: labelClipPath }}
            key="border"
          />
          {this.renderAddon('left')}
          {this.wrapControll(
            <>
              <Control
                {...controlProps}
                className={cn(S.control, controlProps?.className)}
                ref={this.inputRef}
                key="control"
              />
              {isTextArea && controlProps.placeholder && (
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
                onClick={() => this.onNumberWheel(1)}
                tabIndex={-1}
              >
                <Icon type="chevronUp" size={size} />
              </Button>
              <Button
                variant="clear"
                onClick={() => this.onNumberWheel(-1)}
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
            onClipPathChange={this.onLabelClipPathChange}
            key="label"
          >
            {label}
          </Label>
          {this.renderAddon('right')}
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
            onClick={this.onClearPress}
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
}
