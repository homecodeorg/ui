import { FC } from 'react';
import cn from 'classnames';

import { Icon } from 'uilib/components/Icon/Icon';
import { useToggleState } from 'uilib/hooks';

import S from './Checkbox.styl';
import * as T from './Checkbox.types';

export const Checkbox: FC<T.Props> = ({
  className,
  label = '',
  size = 'm',
  variant = 'default',
  error,
  checked = false,
  disabled,
  id,
  onFocus,
  onBlur,
  ...props
}) => {
  const {
    id: componentId,
    isActive,
    isFocused,
    handlers,
  } = useToggleState({
    id,
    onFocus,
    onBlur,
  });

  const classes = cn(
    S.root,
    S[`size-${size}`],
    S[`variant-${variant}`],
    checked && S.checked,
    disabled && S.disabled,
    error && S.hasError,
    isActive && S.isActive,
    isFocused && S.isFocused,
    className
  );

  return (
    <label
      className={classes}
      onPointerDown={handlers.onPointerDown}
      onPointerUp={handlers.onPointerUp}
    >
      <div className={S.controlWrapper}>
        <input
          className={S.control}
          {...props}
          onFocus={handlers.onFocus}
          onBlur={handlers.onBlur}
          id={componentId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          tabIndex={0}
        />
        <Icon type="check" className={S.checkmark} size={size} />
      </div>
      {label}
    </label>
  );
};
