import { ChangeEvent, FC } from 'react';
import cn from 'classnames';

import { useToggleState } from 'uilib/hooks';

import { useRadioGroup } from '../RadioGroup/RadioGroupContext';
import S from './RadioButton.styl';
import * as T from './RadioButton.types';

export const RadioButton: FC<T.Props> = ({
  className,
  label = '',
  size: sizeProp,
  variant: variantProp,
  error: errorProp,
  value,
  checked: checkedProp,
  disabled: disabledProp,
  name: nameProp,
  onChange,
  id,
  onFocus,
  onBlur,
  ...props
}) => {
  const group = useRadioGroup();

  const size = sizeProp ?? group?.size ?? 'm';
  const variant = variantProp ?? group?.variant ?? 'default';
  const error = errorProp ?? group?.error;
  const disabled = Boolean(disabledProp || group?.disabled);
  const name = group ? group.name : nameProp;
  const checked = group
    ? group.value !== undefined && group.value === value
    : Boolean(checkedProp);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (group) group.onChange(value);
    onChange?.(e);
  };

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
          onChange={handleChange}
          onFocus={handlers.onFocus}
          onBlur={handlers.onBlur}
          id={componentId}
          type="radio"
          name={name}
          value={String(value)}
          checked={checked}
          disabled={disabled}
          tabIndex={0}
        />
        <span className={S.dot} aria-hidden />
      </div>
      {label}
    </label>
  );
};
