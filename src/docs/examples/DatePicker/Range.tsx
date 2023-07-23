import { useState } from 'react';
import { DatePicker } from 'uilib';

export default () => {
  const [value, setValue] = useState(['2023-06-9', '2023-07-31']);

  return (
    <>
      <div className={S.display}>{value.join(' - ')}</div>
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
