import { useState } from 'react';
import { DatePicker, DateTime } from 'uilib';

export default () => {
  const [value, setValue] = useState({ year: 2023, month: 7, day: 31 });

  return (
    <>
      <div className={S.display}>
        <DateTime
          value={new Date(value.year, value.month - 1, value.day)}
          format="MMM Do YYYY"
        />
      </div>
      <DatePicker
        size="m"
        value={value}
        onChange={setValue}
        // calendarProps={{ startOfWeek: 0 }}
      />
    </>
  );
};
