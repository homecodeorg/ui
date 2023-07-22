import { useCallback, useState } from 'react';
import cn from 'classnames';

import type { Date } from 'uilib/types';
import { Calendar } from 'uilib/components/Calendar/Calendar';
import { Button } from 'uilib/components/Button/Button';

import * as H from './DatePicker.helpers';
import * as T from './DatePicker.types';
import S from './DatePicker.styl';

export function DatePicker(props: T.Props) {
  const { value, onChange, size, calendarProps } = props;
  const isRange = Array.isArray(value);

  const [isPicking, setIsPicking] = useState(false);

  const onFirstDateChange = useCallback(
    (val: Date) => {
      onChange(isRange ? [val, value[1]] : val);
    },
    [value, onChange, isRange]
  );

  const onPointerDown = () => setIsPicking(true);
  const onPointerUp = () => setIsPicking(false);

  const renderDay = useCallback(
    (val: Date, { className, ...props }) => {
      const { day, year, month } = val;

      if (isRange && isPicking) {
        props.onPointerOver = () => {
          const newVal: [Date, Date] = H.isDateAfter(value[0], val)
            ? [val, value[0]]
            : [value[0], val];

          onChange(newVal);
        };
      }

      const classes = [className, S.day];

      if (isRange) {
        if (H.isDateBetween(val, ...value)) classes.push(S.between);
        if (H.isDateEqual(val, value[0])) classes.push(S.start);
        if (H.isDateEqual(val, value[1])) classes.push(S.end);
      }

      return (
        <Button
          {...props}
          variant="clear"
          className={cn(classes)}
          size={size}
          key={`${year}-${month}-${day}`}
        >
          {day}
        </Button>
      );
    },
    [size, isPicking, isRange, value, onChange]
  );

  return (
    <div
      className={cn(S.root, props.className)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <Calendar
        size={size}
        hideOtherMonthDays
        {...calendarProps}
        renderDay={renderDay}
        value={isRange ? value[0] : value}
        onDayPointerDown={onFirstDateChange}
      />
      {isRange && (
        <Calendar
          size={size}
          hideOtherMonthDays
          {...calendarProps}
          renderDay={renderDay}
          value={value[1]}
          onDayPointerDown={val => onChange([value[0], val])}
          onDayPointerUp={val => onChange([value[0], val])}
        />
      )}
    </div>
  );
}
