import { Component, createRef, ChangeEvent } from 'react';
import cn from 'classnames';
import { createStore } from 'justorm/react';
import omit from 'lodash.omit';

import { capitalize } from '../../tools/string';
import { generateUID } from '../../tools/uid';

import { Label } from '../Label/Label';
import { RequiredStar } from '../RequiredStar/RequiredStar';
import { AssistiveText } from '../AssistiveText/AssistiveText';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

import S from './Input.styl';
import * as T from './Input.types';

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
  };

  constructor(props: T.Props) {
    super(props);

    const inputValue = props.value || '';
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
  }

  componentDidUpdate(prevProps: T.Props) {
    const { value } = this.props;
    const valueChanged = prevProps.value !== value;

    this.updateSelection();
    this.updateAutoComplete();

    if (valueChanged) {
      this.store.inputValue = value;
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
    const { type, isNullable } = this.props;

    if (type === 'number') {
      if (val) return parseFloat(val);
      if (isNullable && val === '') return null;
      return 0;
    }
    return val;
  }

  clear = () => {
    const { onChange, onClear } = this.props;

    if (onClear) onClear();
    if (onChange) onChange('' as any);
    // this.inputRef.current?.focus();
    this.isClearPressed = false;
  };

  onClearMouseDown = () => {
    this.isClearPressed = true;
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

  onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { onChange, changeOnEnd, type } = this.props;
    const value = this.getValue(e.target.value);
    const isNumber = type === 'number';

    // @ts-ignore
    if (!isNumber) this.cursorPos = this.inputRef.current.selectionStart;

    if (changeOnEnd) {
      this.store.inputValue = value;
      this.updateHasValue();
    } else if (onChange) onChange(value, e);
  };

  onLabelClipPathChange = (clipPath: string) =>
    (this.store.labelClipPath = clipPath);

  onTypingEnd = () => {
    const { onChange } = this.props;
    const value = this.getValue();

    if (onChange) onChange(value);
  };

  onFocus = e => {
    const { onFocus } = this.props;

    this.store.isFocused = true;
    this.updateLabelPosition();
    if (onFocus) onFocus(e);
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
    if (checkAutofill && onChange && !value && val) onChange(val);
    if (onBlur) onBlur(e);
  };

  getControlProps(): T.ControlProps {
    const { type, value, label, isNullable, placeholder } = this.props;
    const { autoComplete, isLabelOnTop } = this.store;

    const props = {
      ...omit(this.props, [
        'className',
        'clear',
        'onClear',
        'hasClear',
        'size',
        'label',
        'error',
        'checkAutofill',
        'placeholder',
        'adornmentLeft',
        'adornmentRight',
        'forceLabelOnTop',
        'changeOnEnd',
      ]),
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    };

    // @ts-ignore
    if (value === null && !isNullable) props.value = type === 'number' ? 0 : '';
    if (placeholder && !value && (!label || isLabelOnTop))
      props.placeholder = placeholder;
    if (!autoComplete) {
      props.autoComplete = this.uid;
      delete props.name;
    }
    if (props.value === undefined) props.value = '';

    return props;
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
      type,
      label,
      error,
      clear,
      hasClear,
      required,
      disabled,
    } = this.props;
    const { isFocused, hasValue, labelClipPath, isLabelOnTop } = this.store;

    const isTextArea = type === 'textarea';
    const Control = isTextArea ? 'textarea' : 'input';
    const controlProps = this.getControlProps();
    const classes = cn(
      S.root,
      isTextArea && S.isTextArea,
      S[`size-${size}`],
      isFocused && S.isFocused,
      error && S.hasError,
      clear && S.isClear,
      hasClear && S.hasClear,
      disabled && S.isDisabled,
      className
    );

    return (
      <div className={classes}>
        {/* eslint-disable-next-line */}
        <label className={S.main} key="main">
          <div
            className={S.border}
            style={{ clipPath: labelClipPath }}
            key="border"
          />
          {this.renderAdornment('left')}
          <Control
            className={S.control}
            {...controlProps}
            // @ts-ignore
            ref={this.inputRef}
            key="control"
          />
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
          {hasClear && hasValue && (
            <Button
              className={S.clearButton}
              variant="clear"
              size={size}
              isSquare
              onMouseDownCapture={this.onClearMouseDown}
              onClick={this.clear}
            >
              <Icon className={S.clearIcon} type="clear" />
            </Button>
          )}
          {required && <RequiredStar size={size} />}
        </label>
        {!disabled && typeof error === 'string' && (
          <AssistiveText variant="danger" size={size}>
            {error}
          </AssistiveText>
        )}
      </div>
    );
  }
}

export type InputProps = T.Props;
