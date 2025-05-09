import { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';

import S from './Calendar.styl';
import * as T from './Calendar.types';
import * as H from './Calendar.helpers';

import { Input } from 'uilib/components/Input/Input';
import { Select } from 'uilib/components/Select/Select';
import { useDebounceCallback } from 'uilib/hooks/useDebounce';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MIN_YEAR = 1970;

const renderDayDefault = (val: T.Day, props: T.DayProps) => {
  const { day, year, month } = val;

  return (
    <div key={`${year}-${month}-${day}`} {...props}>
      {day}
    </div>
  );
};

export function Calendar({
  className,
  value,
  onDayPointerDown,
  onDayPointerUp,
  renderDay,
  renderWeekDayLabel,
  renderMonthLabel,
  renderMonthesLabel,
  renderYearLabel,
  startOfWeek = 1,
  weekendClassName,
  hideOtherMonthDays,
  isDayDisabled,
  size,
}: T.Props) {
  const date = useMemo(() => H.valueToDate(value), [value]);

  const [month, setMonth] = useState(date.getMonth() + 1);
  const [year, setYear] = useState(date.getFullYear());

  const weekDaysArray = useMemo(
    () => H.getWeekDaysArray(startOfWeek),
    [startOfWeek]
  );
  const daysArray = useMemo(
    () => H.getDaysArray(year, month, startOfWeek),
    [startOfWeek, month, year]
  );

  const monthOptions = useMemo(
    () =>
      MONTHS.map((m, i) => ({
        id: i + 1,
        label: renderMonthLabel?.(i + 1) ?? m,
      })),
    [renderMonthLabel]
  );

  const onYearChange = useCallback((e, val) => {
    if (String(val).length === 4) setYear(Math.max(MIN_YEAR, val));
    else setYear(val);
  }, []);

  const onYearBlur = () => {
    if (year < MIN_YEAR) setYear(MIN_YEAR);
  };

  const handleWheelScroll = useDebounceCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        // Scroll Up
        setMonth(prevMonth => {
          if (prevMonth === 1) {
            setYear(prevYear => prevYear - 1);
            return 12;
          }
          return prevMonth - 1;
        });
      } else if (event.deltaY > 0) {
        // Scroll Down
        setMonth(prevMonth => {
          if (prevMonth === 12) {
            setYear(prevYear => prevYear + 1);
            return 1;
          }
          return prevMonth + 1;
        });
      }
    },
    1000,
    [setMonth, setYear]
  );

  const classes = cn(
    S.root,
    S[`size-${size}`],
    className,
    hideOtherMonthDays && S.hideOtherMonthDays
  );

  return (
    <div className={classes}>
      <div className={S.header}>
        <Input
          className={S.year}
          type="number"
          min={MIN_YEAR}
          // @ts-ignore
          size={size}
          label={renderYearLabel?.(year) ?? 'Year'}
          value={year}
          // @ts-ignore
          onChange={onYearChange}
          onBlur={onYearBlur}
        />
        <Select
          className={S.month}
          size={size}
          label={renderMonthesLabel?.(month) ?? 'Month'}
          options={monthOptions}
          value={month}
          onChange={val => setMonth(val)}
          required
          hideRequiredStar
        />
      </div>

      <div className={S.weekDays}>
        {weekDaysArray.map((day, weekdayIndex) => (
          <div
            key={`weekday-${day}`}
            className={cn(S.day, H.isWeekend(weekdayIndex) && weekendClassName)}
          >
            {renderWeekDayLabel?.(day) ?? H.weekDays[day]}
          </div>
        ))}
      </div>

      <div className={S.days} onWheel={handleWheelScroll}>
        {daysArray.map((day, weekdayIndex) => {
          const className = cn(
            S.day,
            day.currentMonth && S.currMonth,
            H.isWeekend(weekdayIndex) && weekendClassName,
            H.isSameDay(day, value) && S.selected,
            isDayDisabled?.(day) && S.disabled
          );

          const dayProps = { className } as T.DayProps;

          if (onDayPointerDown) {
            dayProps.onPointerDown = () => onDayPointerDown(day);
          }

          if (onDayPointerUp) {
            dayProps.onPointerUp = () => onDayPointerUp(day);
          }

          return renderDay?.(day, dayProps) ?? renderDayDefault(day, dayProps);
        })}
      </div>
    </div>
  );
}
