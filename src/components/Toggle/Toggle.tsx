import cn from 'classnames';
import { useToggleState } from 'uilib/hooks/useToggleState';

import S from './Toggle.styl';
import * as T from './Toggle.types';

export type ToggleProps = T.Props;

export function Toggle(props: ToggleProps) {
  const {
    className,
    label,
    size = 'm',
    variant = 'default',
    error,
    ...inputProps
  } = props;
  const { checked, disabled } = inputProps;
  const { id, isActive, isFocused, handlers } = useToggleState(props);

  const classes = cn(
    S.root,
    S[`size-${size}`],
    S[`variant-${variant}`],
    checked && S.checked,
    disabled && S.disabled,
    // error && S.hasError,
    isActive && S.isActive,
    // isFocused && S.isFocused,
    className
  );

  return (
    <label
      className={classes}
      onPointerDown={handlers.onPointerDown}
      onPointerUp={handlers.onPointerUp}
    >
      <div className={S.toggleWrapper}>
        <input
          className={S.control}
          {...inputProps}
          onFocus={handlers.onFocus}
          onBlur={handlers.onBlur}
          id={id}
          type="checkbox"
          tabIndex={0}
        />
        <div className={S.track}>
          <div className={S.thumb} />
        </div>
      </div>
      {label && <span className={S.label}>{label}</span>}
    </label>
  );
}
