import { ChangeEvent, Component, DOMAttributes, ReactNode } from 'react';
import cn from 'classnames';
import { createStore } from 'justorm/react';

import { uid, Icon } from 'uilib';

import { Size } from '../../types';

import S from './Checkbox.styl';

type ControlProps = DOMAttributes<HTMLInputElement>;

type Props = ControlProps & {
  id?: string;
  className?: string;
  label?: ReactNode;
  checked?: boolean;
  error?: string | boolean;
  size: Size;
  // onFocus?: (e: FocusEvent) => void;
  // onBlur?: (e: FocusEvent) => void;
};

export class Checkbox extends Component<Props> {
  id;
  store;

  static defaultProps = {
    size: 'm',
    label: '',
    checked: false,
  };

  constructor(props) {
    super(props);
    this.id = props.id || uid.generateUID();
    this.store = createStore(this, { isActive: false, isFocused: false });
  }

  onMouseDown = () => {
    this.store.isActive = true;
  };

  onMouseUp = () => {
    this.store.isActive = false;
  };

  onFocus = (e: any) => {
    const { onFocus } = this.props;

    this.store.isFocused = true;
    onFocus?.(e);
  };

  onBlur = (e: any) => {
    const { onBlur } = this.props;

    this.store.isFocused = false;
    onBlur?.(e);
  };

  render() {
    const { className, label, size, error, ...props } = this.props;
    const { checked } = props;
    const { isActive, isFocused } = this.store;

    const classes = cn(
      S.root,
      S[`size-${size}`],
      checked && S.isChecked,
      error && S.hasError,
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
          <Icon type="check" className={S.checkmark} />
        </div>
        {label}
      </label>
    );
  }
}
