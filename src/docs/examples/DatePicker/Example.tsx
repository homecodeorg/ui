import { useState } from 'react';
import { DatePicker } from 'uilib';

export default () => {
  const [value, setValue] = useState({ year: 2023, month: 7, day: 31 }, []);
  return (
    <>
      {value.year}-{value.month}-{value.day}
      <br />
      <br />
      <DatePicker
        size="m"
        value={value}
        onChange={setValue}
        // calendarProps={{ startOfWeek: 0 }}
      />
    </>
  );
};
