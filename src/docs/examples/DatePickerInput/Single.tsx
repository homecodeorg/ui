import { useState } from 'react';
import { DatePickerInput } from 'uilib';

export default () => {
  const [value, setValue] = useState('2023-07-31');

  return <DatePickerInput size="m" value={value} onChange={setValue} />;
};
