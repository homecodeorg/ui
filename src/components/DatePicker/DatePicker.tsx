import { useCallback, useState } from 'react';
import cn from 'classnames';

import type { Date } from 'uilib/types';
import { Calendar } from 'uilib/components/Calendar/Calendar';
import { Button } from 'uilib/components/Button/Button';

import * as H from './DatePicker.helpers';
import * as T from './DatePicker.types';
import S from './DatePicker.styl';

export function DatePicker(props: T.Props) {
  const { value, onChange, size, doubleCalendar, calendarProps = {} } = props;
  const isRange = Array.isArray(value);

  const [isPicking, setIsPicking] = useState(false);

  const onFirstDateChange = useCallback(
    (val: Date) => {
      const valStr = H.dateToString(val);
      onChange(isRange ? [valStr, value[1]] : valStr);
    },
    [value, onChange, isRange]
  );

  const onPointerDown = () => setIsPicking(true);
  const onPointerUp = () => setIsPicking(false);

  const renderDay = useCallback(
    (val: Date, { className, ...props }) => {
      const { day, year, month } = val;
      const valStr = H.dateToString(val);

      if (isRange && isPicking) {
        props.onPointerOver = () => {
          const newVal = H.isDateAfter(H.strigToDate(value[0]), val)
            ? [valStr, value[0]]
            : [value[0], valStr];

          onChange(newVal as T.Value);
        };
      }

      const classes = [className, S.day];

      if (isRange) {
        const from = H.strigToDate(value[0]);
        const to = H.strigToDate(value[1]);

        if (H.isDateBetween(val, from, to)) classes.push(S.between);
        if (H.isDateEqual(val, from)) classes.push(S.start);
        if (H.isDateEqual(val, to)) classes.push(S.end);
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

  calendarProps.className = cn(calendarProps.className, S.calendar);

  return (
    <div
      className={cn(
        S.root,
        doubleCalendar && S.doubleCalendar,
        props.className
      )}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <Calendar
        size={size}
        hideOtherMonthDays={isRange}
        {...calendarProps}
        renderDay={renderDay}
        value={H.strigToDate(isRange ? value[0] : value)}
        onDayPointerDown={onFirstDateChange}
        onDayPointerUp={undefined!} // NOTE: TS error only when build rollup
      />
      {isRange && doubleCalendar && (
        <Calendar
          size={size}
          hideOtherMonthDays={isRange}
          {...calendarProps}
          renderDay={renderDay}
          value={H.strigToDate(value[1])}
          onDayPointerDown={val => onChange([value[0], H.dateToString(val)])}
          onDayPointerUp={val => onChange([value[0], H.dateToString(val)])}
        />
      )}
    </div>
  );
}
