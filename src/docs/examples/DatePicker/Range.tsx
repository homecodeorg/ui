import { useState } from 'react';
import { DatePicker, Checkbox } from 'uilib';

const date = { year: 2023, month: 6, day: 6 };
const isDayDisabled = d =>
  d.year <= date.year &&
  (d.month < date.month || (d.month === date.month && d.day < date.day));

export default () => {
  const [value, setValue] = useState(['2023-06-9', '2023-07-31']);
  const [doubleCalendar, setDoubleCalendar] = useState(true);

  return (
    <>
      <div className={S.display}>{value.join(' - ')}</div>
      <DatePicker
        size="s"
        value={value}
        onChange={setValue}
        // className={cn(S.calendars, doubleCalendar && S.doubleCalendar)}
        doubleCalendar={doubleCalendar}
        calendarProps={{
          // className: S.calendar,
          isDayDisabled,
          //  startOfWeek: 0
        }}
      />
      <Checkbox
        checked={doubleCalendar}
        onChange={() => setDoubleCalendar(!doubleCalendar)}
        label="doubleCalendar"
      />
    </>
  );
};
