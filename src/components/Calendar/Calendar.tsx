import { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';

import S from './Calendar.styl';
import * as T from './Calendar.types';
import * as H from './Calendar.helpers';

import { Input } from 'uilib/components/Input/Input';
import { Select } from 'uilib/components/Select/Select';

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

export function Calendar({
  value,
  onDayClick,
  renderWeekDayLabel,
  renderMonthLabel,
  renderMonthesLabel,
  renderYearLabel,
  startOfWeek,
  weekendClassName,
  size,
}: T.Props) {
  const date = useMemo(() => H.valueToDate(value), [value]);

  const [month, setMonth] = useState(date.getMonth() + 1);
  const [year, setYear] = useState(date.getFullYear());

  const weekDaysArray = useMemo(
    () => H.getWeekDaysArray(startOfWeek),
    [startOfWeek]
  );
  const daysArray = H.getDaysArray(year, month);

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

  const renderDay = useCallback((val: T.Value, weekdayIndex: number) => {
    const { day, year, month, currentMonth } = val;
    const isWeekend = H.isWeekend(weekdayIndex);
    const classes = cn(
      S.day,
      currentMonth && S.currMonth,
      isWeekend && weekendClassName
    );

    return (
      <div
        key={`${year}-${month}-${day}`}
        className={classes}
        onClick={() => onDayClick?.(val)}
      >
        {day}
      </div>
    );
  }, []);

  return (
    <div className={cn(S.root, S[`size-${size}`])}>
      <div className={S.header}>
        <Input
          className={S.year}
          type="number"
          min={MIN_YEAR}
          // @ts-ignore
          size={size}
          // @ts-ignore
          label={renderYearLabel?.(year) ?? 'Year'}
          value={year}
          // @ts-ignore
          onChange={onYearChange}
          onBlur={onYearBlur}
        />
        <Select
          className={S.month}
          size={size}
          // @ts-ignore
          label={renderMonthesLabel?.(month) ?? 'Month'}
          options={monthOptions}
          value={month}
          onChange={val => setMonth(val)}
        />
      </div>

      <div className={S.weekDays}>
        {weekDaysArray.map((day, weekdayIndex) => (
          <div
            key={day}
            className={cn(S.day, H.isWeekend(weekdayIndex) && weekendClassName)}
          >
            {renderWeekDayLabel?.(day) ?? H.weekDays[day]}
          </div>
        ))}
      </div>
      <div className={S.days}>
        {daysArray.map((d, weekdayIndex) => renderDay(d, weekdayIndex))}
      </div>
    </div>
  );
}
