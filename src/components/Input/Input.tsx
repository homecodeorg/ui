import { Component, createRef } from 'preact';
import cn from 'classnames';
import omit from 'lodash.omit';
import { createStore } from 'justorm/preact';

import { capitalize } from 'tools/string';

import { Icon } from 'components/Icon/Icon';
import { AssistiveText } from 'components/AssistiveText/AssistiveText';

import { LABEL_MULTIPLIER, LABEL_PADDING } from './Input.constants.json';
import S from './Input.styl';
import * as T from './Input.types';

function getLabelClipPath(left, width) {
  const offset = 10;
  const A = left - LABEL_PADDING;
  // @ts-ignore
  const B = width === 0 ? 0 : left + width * LABEL_MULTIPLIER + LABEL_PADDING;
  const cutWidth = 5;
  const min = `-${offset}px`;
  const max = `calc(100% + ${offset}px)`;

  return `polygon(${min} ${min}, ${min} ${max}, ${max} ${max}, ${max} ${min}, ${B}px ${min}, ${B}px ${cutWidth}px, ${A}px ${cutWidth}px, ${A}px ${min})`;
}

export type InputProps = T.Props;

export class Input extends Component<T.Props> {
  inputRef = createRef<HTMLInputElement>();

  labelElem = createRef<HTMLDivElement>();

  store;
  cursorPos = 0;

  isTextArea = false;
  isNumber = false;
  isFile = false;
  hasValue = false;

  prevLabelText = '';

  static defaultProps = {
    size: 'm',
  };

  constructor(props) {
    super(props);

    const { type } = props;

    this.isNumber = type === 'number';
    this.isFile = type === 'file';
    this.isTextArea = type === 'textarea';
    this.store = createStore(this, {
      isFocused: false,
      labelClipPath: '',
    });

    this.updateHasValue();
  }

  componentDidMount() {
    this.updateLabelWidth();
    document.addEventListener('keyup', this.onDocKeyUp, true);
  }

  componentDidUpdate(prevProps) {
    const {
      label,
      forceLabelOnTop,
      size,
      type,
      adornmentLeft,
      value,
      disabled,
    } = this.props;
    const { isFocused } = this.store;

    const labelElem = this.labelElem.current;
    const labelChanged =
      prevProps.label !== label ||
      (!isFocused && prevProps.forceLabelOnTop !== forceLabelOnTop) ||
      (labelElem && labelElem.innerText !== this.prevLabelText);
    const valueChanged = prevProps.value !== value;
    const sizeChanged = prevProps.size !== size;
    const disabledChanged = prevProps.disabled !== disabled;
    const adornmentChanged =
      Boolean(prevProps.adornmentLeft) !== Boolean(adornmentLeft);

    const needUpdateWidth =
      valueChanged ||
      labelChanged ||
      sizeChanged ||
      disabledChanged ||
      adornmentChanged;

    this.setSelection();
    if (valueChanged) this.updateHasValue();
    if (needUpdateWidth) this.updateLabelWidth();
  }

  updateHasValue() {
    const { value, defaultValue } = this.props;
    this.hasValue = this.isNumber || Boolean(value || defaultValue);
  }

  updateLabelWidth() {
    const labelElem = this.labelElem.current;
    if (!labelElem) return;

    // @ts-ignore
    const { disabled } = this.props;
    const { isFocused } = this.store;
    const { offsetLeft, offsetWidth, innerText } = labelElem;
    const labelWidth =
      !disabled && this.isLabelOnTop(isFocused) ? offsetWidth : 0;

    this.prevLabelText = innerText;
    this.store.labelClipPath = getLabelClipPath(offsetLeft, labelWidth);
  }

  isLabelOnTop() {
    const { forceLabelOnTop, adornmentLeft } = this.props;
    const { isFocused } = this.store;

    return (
      forceLabelOnTop || this.hasValue || isFocused || Boolean(adornmentLeft)
    );
  }

  getValue() {
    const val = this.inputRef.current.value;

    if (this.isNumber) return val ? parseFloat(val) : 0;
    return val;
  }

  setSelection() {
    const { type } = this.props;
    const elem = this.inputRef.current;

    if (!elem || type !== 'text') return;

    elem.selectionStart = this.cursorPos;
    elem.selectionEnd = this.cursorPos;
  }

  onDocKeyUp = e => {
    const { isFocused } = this.store;

    if (isFocused && e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.inputRef.current?.blur();
    }
  };

  onChange = e => {
    const { onChange } = this.props;
    const value = this.getValue();

    // @ts-ignore
    if (!this.isNumber) this.cursorPos = this.inputRef.current.selectionStart;
    if (onChange && onChange(e, value) === false) return;

    this.hasValue = this.isNumber || Boolean(value);
  };

  onFocus = e => {
    const { onFocus } = this.props;

    this.store.isFocused = true;
    this.updateLabelWidth();
    if (onFocus) onFocus(e);
  };

  onBlur = e => {
    const { onBlur, onChange, value, checkAutofill } = this.props;
    const val = this.getValue();

    this.store.isFocused = false;
    this.updateLabelWidth();
    // some browsers not fire `onchange` after autofill
    if (checkAutofill && onChange && !value && val) onChange(e, val);
    if (onBlur) onBlur(e);
  };

  getControlProps(): T.ControlProps {
    const { value, placeholder } = this.props;
    const { isFocused } = this.store;

    const props = {
      ...omit(this.props, [
        'className',
        'clear',
        'size',
        'label',
        // 'value',
        'error',
        'checkAutofill',
        'placeholder',
        'adornmentLeft',
        'adornmentRight',
        'forceLabelOnTop',
      ]),
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    };

    if (placeholder && !value && isFocused) props.placeholder = placeholder;

    return props;
  }

  renderLabel() {
    const { label } = this.props;

    if (!label) return null;

    const isOnTop = this.isLabelOnTop();
    const labelClasses = cn(S.label, isOnTop && S.onTop);

    return [
      <div className={labelClasses} key="label-text">
        {label}
      </div>,
      <div className={S.labelGap} ref={this.labelElem} key="label-gap">
        {label}
      </div>,
    ];
  }

  renderAdornment(type) {
    const name = `adornment${capitalize(type)}`;
    const content = this.props[name];

    if (!content) return null;

    const props = {
      className: cn(S[name], this.props[`${name}ClassName`]),
      key: name,
    };
    const isString = typeof content === 'string';
    const elem = isString ? <span>{content}</span> : content;

    if (isString) props.title = content;

    return <div {...props}>{elem}</div>;
  }

  render() {
    const {
      className,
      size,
      // variant,
      clear,
      error,
      required,
      disabled,
      adornmentLeft,
      adornmentRight,
      adornmentRightClassName,
    } = this.props;
    const { isFocused, labelClipPath } = this.store;

    const Control = this.isTextArea ? 'textarea' : 'input';
    const controlProps = this.getControlProps();
    const classes = cn(
      S.root,
      this.isTextArea && S.isTextArea,
      S[`size-${size}`],
      // S[`variant-${variant}`],
      isFocused && S.isFocused,
      disabled && S.isDisabled,
      error && S.hasError,
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
            ref={this.inputRef}
            key="control"
            autoComplete="off"
          />
          {this.renderAdornment('right')}
          {this.renderLabel()}
          {required && <div className={S.requiredStar} key="required-icon" />}
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
