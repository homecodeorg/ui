import { Component, createRef, ChangeEvent } from 'react';
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

    const inputValue = props.value || props.defaultValue || '';
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

    if (this.isTextArea())
      this.inputRef.current.innerText = this.store.inputValue;
  }

  componentDidUpdate(prevProps: T.Props) {
    const { value } = this.props;

    this.updateSelection();
    this.updateAutoComplete();

    if (value !== prevProps.value && value !== this.store.inputValue) {
      this.store.inputValue = value;
      // @ts-ignore
      // if (this.isTextArea()) this.inputRef.current.innerText = value;
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

  isLabelOnTop(hasValue = this.store?.hasValue) {
    const { forceLabelOnTop, adornmentLeft } = this.props;

    return (
      forceLabelOnTop ||
      Boolean(adornmentLeft) ||
      hasValue ||
      this.store?.isFocused
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

    this.onChange(value);
  };

  onChange = (value, e?) => {
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

  onTextAreaInput = e => {
    const { onInput } = this.props;

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
        'size',
        'error',
        'checkAutofill',
        'adornmentLeft',
        'adornmentRight',
        'forceLabelOnTop',
        'changeOnEnd',
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
      props.autoComplete = this.uid;
      delete props.name;
    }

    if (props.value === undefined) props.value = '';

    return props;
  }

  wrapControll(control) {
    if (this.isTextArea()) {
      const { size } = this.props;
      const { labelClipPath } = this.store;

      return (
        <Scroll
          y
          size={size}
          fadeSize="s"
          className={S.scroller}
          suppressHydrationWarning
          innerProps={{ style: { clipPath: labelClipPath } }}
          offset={{
            y: { before: TEXTAREA_SCROLL_TOP_OFFSET[size], after: 20 },
          }}
        >
          {control}
        </Scroll>
      );
    }

    return control;
  }

  renderAdornment(type: 'right' | 'left') {
    const name = `adornment${capitalize(type)}`;
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
      required,
      disabled,
    } = this.props;
    const { isFocused, hasValue, labelClipPath, isLabelOnTop } = this.store;
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
          {this.renderAdornment('left')}
          {this.wrapControll(
            <Control
              {...controlProps}
              className={cn(S.control, controlProps?.className)}
              ref={this.inputRef}
              key="control"
            />
          )}
          <Label
            className={S.label}
            size={size}
            disabled={disabled}
            isOnTop={isLabelOnTop}
            isError={Boolean(error)}
            isFocused={isFocused}
            onClipPathChange={this.onLabelClipPathChange}
          >
            {label}
          </Label>
          {this.renderAdornment('right')}
          {required && <RequiredStar size={size} />}
        </label>
        {hasClear && !disabled && hasValue && (
          <Button
            className={S.clearButton}
            variant="clear"
            size={size}
            square
            onClick={this.onClearPress}
            title=""
          >
            <Icon className={S.clearIcon} size={size} type="close" />
          </Button>
        )}
        {!disabled && typeof error === 'string' && (
          <AssistiveText variant="danger" size={size}>
            {error}
          </AssistiveText>
        )}
      </div>
    );
  }
}
