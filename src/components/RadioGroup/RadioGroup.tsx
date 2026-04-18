import {
  FC,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';

import { RadioGroupContext } from './RadioGroupContext';
import S from './RadioGroup.styl';
import type { Props, RadioGroupContextValue } from './RadioGroup.types';

export const RadioGroup: FC<Props> = ({
  className,
  children,
  label,
  value,
  defaultValue,
  onChange,
  name: nameProp,
  size = 'm',
  variant = 'default',
  error,
  disabled,
  orientation = 'vertical',
  ...rest
}) => {
  const reactId = useId();
  const name = nameProp ?? `radio${reactId.replace(/:/g, '')}`;

  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : uncontrolled;

  const setValue = useCallback(
    (next: string | number) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      name,
      value: selectedValue,
      onChange: setValue,
      size,
      variant,
      error,
      disabled,
    }),
    [name, selectedValue, setValue, size, variant, error, disabled]
  );

  const inner = (
    <div
      className={cn(
        S.inner,
        orientation === 'horizontal' && S.horizontal
      )}
    >
      <RadioGroupContext.Provider value={contextValue}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  );

  return (
    <fieldset
      className={cn(S.root, className)}
      disabled={disabled}
      {...rest}
    >
      {label != null && label !== '' && (
        <legend className={S.legend}>{label}</legend>
      )}
      {inner}
    </fieldset>
  );
};
