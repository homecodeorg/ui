import { Component, ComponentChild } from 'react';
import cn from 'classnames';
import { nanoid } from 'nanoid';
import { createStore } from 'justorm/preact';

import { Button } from 'components/Button/Button';
import { Size } from 'types';
import S from './Checkbox.styl';

type Props = {
  className?: string;
  label?: ComponentChild;
  checked?: boolean;
  size: Size;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
};

export class Checkbox extends Component<Props> {
  id;
  store;

  private defaultProps = {
    size: 's',
    label: '',
    checked: false,
  };

  constructor(props) {
    super(props);
    this.id = props.id || nanoid();
    this.store = createStore(this, { isActive: false, isFocused: false });
  }

  onMouseDown = e => {
    this.store.isActive = true;
  };

  onMouseUp = e => {
    this.store.isActive = false;
  };

  onFocus = e => {
    const { onFocus } = this.props;

    this.store.isFocused = true;
    if (onFocus) onFocus(e);
  };

  onBlur = e => {
    const { onBlur } = this.props;

    this.store.isFocused = false;
    if (onBlur) onBlur(e);
  };

  render() {
    const { className, label, size, ...props } = this.props;
    const { checked } = props;
    const { isActive, isFocused } = this.store;

    const classes = cn(
      S.root,
      S[`size-${size}`],
      checked && S.isChecked,
      isActive && S.isActive,
      isFocused && S.isFocused,
      className
    );

    return (
      <label
        className={classes}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        <div className={S.controlWrapper}>
          <input
            className={S.control}
            {...props}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            id={this.id}
            type="checkbox"
            tabIndex={0}
          />
          <div className={S.checkmark} />
        </div>
        {label}
      </label>
    );
  }
}
