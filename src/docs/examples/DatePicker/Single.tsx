import { useState } from 'react';
import { DatePicker } from 'uilib';

export default () => {
  const [value, setValue] = useState('2023-07-31');

  return (
    <>
      <div className={S.display}>{value}</div>
      <DatePicker
        size="m"
        value={value}
        onChange={setValue}
        // calendarProps={{ startOfWeek: 0 }}
      />
    </>
  );
};
