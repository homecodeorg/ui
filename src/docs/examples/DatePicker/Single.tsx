import { useState } from 'react';
import { DatePicker } from 'uilib';

const date = { year: 2023, month: 7, day: 31 };
const isDayDisabled = d =>
  d.year <= date.year &&
  (d.month < date.month || (d.month === date.month && d.day < 10));

export default () => {
  const [value, setValue] = useState('2023-07-31');

  return (
    <>
      <div className={S.display}>{value}</div>
      <DatePicker
        size="m"
        value={value}
        onChange={setValue}
        calendarProps={{
          startOfWeek: 0,
          isDayDisabled,
        }}
      />
    </>
  );
};
