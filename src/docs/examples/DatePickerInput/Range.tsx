import { useState } from 'react';
import { DatePickerInput } from 'uilib';

export default () => {
  const [value, setValue] = useState(['2023-06-9', '2023-07-31']);

  return (
    <DatePickerInput
      size="m"
      value={value}
      onChange={setValue}
      popupProps={{
        blur: true,
        elevation: 1,
      }}
    />
  );
};
