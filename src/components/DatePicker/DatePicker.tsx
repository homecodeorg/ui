import { useCallback } from 'react';
import cn from 'classnames';

import type { Date } from 'uilib/types';
import { Calendar } from 'uilib/components/Calendar/Calendar';
import { Button } from 'uilib/components/Button/Button';

import * as T from './DatePicker.types';
import S from './DatePicker.styl';

export function DatePicker(props: T.Props) {
  const { value, onChange, size, calendarProps } = props;
  const isRange = Array.isArray(value);

  const onFirstDateChange = useCallback(
    (val: Date) => {
      onChange(isRange ? [val, value[1]] : val);
    },
    [value, onChange, isRange]
  );

  const renderDay = useCallback(
    (val: Date, { className, ...props }) => {
      const { day, year, month } = val;

      return (
        <Button
          {...props}
          variant="clear"
          className={cn(className, S.day)}
          size={size}
          key={`${year}-${month}-${day}`}
        >
          {day}
        </Button>
      );
    },
    [size]
  );

  return (
    <div className={S.root}>
      <Calendar
        size={size}
        {...calendarProps}
        value={isRange ? value[0] : value}
        onDayClick={onFirstDateChange}
        renderDay={renderDay}
      />
      {isRange && (
        <Calendar
          size={size}
          {...calendarProps}
          value={value[1]}
          onDayClick={val => onChange([value[0], val])}
          renderDay={renderDay}
        />
      )}
    </div>
  );
}
