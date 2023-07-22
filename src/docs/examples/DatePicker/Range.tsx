import { useState } from 'react';
import { DatePicker, DateTime } from 'uilib';

export default () => {
  const [value, setValue] = useState([
    { year: 2023, month: 6, day: 9 },
    { year: 2023, month: 7, day: 31 },
  ]);

  return (
    <>
      <div className={S.display}>
        <DateTime
          value={new Date(value[0].year, value[0].month - 1, value[0].day)}
          format="MMM Do YYYY"
        />
        {' - '}
        <DateTime
          value={new Date(value[1].year, value[1].month - 1, value[1].day)}
          format="MMM Do YYYY"
        />
      </div>
      <DatePicker
        size="s"
        value={value}
        onChange={setValue}
        className={S.calendars}
        calendarProps={{
          className: S.calendar,
          //  startOfWeek: 0
        }}
      />
    </>
  );
};
