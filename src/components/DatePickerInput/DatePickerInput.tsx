import { useState, useCallback } from 'react';
import cn from 'classnames';

import { strToDate } from 'uilib/tools/date';
import { DateTime } from 'uilib/components/DateTime/DateTime';
import { DatePicker } from 'uilib/components/DatePicker/DatePicker';
import { Button } from 'uilib/components/Button/Button';
import { Popup } from 'uilib/components/Popup/Popup';

import * as T from './DatePickerInput.types';
import S from './DatePickerInput.styl';

export function DatePickerInput(props: T.Props) {
  const {
    value,
    onChange,
    variant = 'default',
    size = 'm',
    popupProps,
    buttonProps,
    displayFormat = 'MMM Do YYYY',
  } = props;

  const isRange = Array.isArray(value);
  const isControlled = popupProps?.isOpen !== undefined;
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback(
    (newValue: T.Value) => {
      onChange(newValue);
      if (!isRange) {
        if (!isControlled) {
          setIsOpen(false);
        }
        popupProps?.onClose?.();
      }
    },
    [onChange, isRange, isControlled, popupProps]
  );

  const handleClose = useCallback(() => {
    if (!isControlled) {
      setIsOpen(false);
    }
    popupProps?.onClose?.();
  }, [popupProps, isControlled]);

  const handleOpen = useCallback(() => {
    if (!isControlled) {
      setIsOpen(true);
    }
    popupProps?.onOpen?.();
  }, [popupProps, isControlled]);

  return (
    <Popup
      size={size}
      focusControl
      direction="bottom-right"
      isOpen={isControlled ? popupProps.isOpen : isOpen}
      onOpen={isControlled ? popupProps.onOpen : handleOpen}
      onClose={isControlled ? popupProps.onClose : handleClose}
      {...popupProps}
      trigger={
        // @ts-ignore
        <Button variant={variant} size={size} {...buttonProps}>
          {isRange ? (
            <>
              <DateTime value={strToDate(value[0])} format={displayFormat} />
              {' - '}
              <DateTime value={strToDate(value[1])} format={displayFormat} />
            </>
          ) : (
            <DateTime value={strToDate(value)} format={displayFormat} />
          )}
        </Button>
      }
      contentProps={{
        className: cn(
          S.popupContent,
          props.doubleCalendar && S.doubleCalendar,
          S[`size-${size}`],
          popupProps?.contentProps?.className
        ),
      }}
      content={
        <DatePicker
          {...props}
          onChange={handleChange}
          className={S.content}
          calendarProps={{ className: S.calendar }}
        />
      }
    />
  );
}
