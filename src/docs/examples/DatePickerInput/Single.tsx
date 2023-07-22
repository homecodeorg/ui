import { useState } from 'react';
import { DatePickerInput } from 'uilib';

export default () => {
  const [value, setValue] = useState({ year: 2023, month: 7, day: 31 });

  return <DatePickerInput size="m" value={value} onChange={setValue} />;
};
