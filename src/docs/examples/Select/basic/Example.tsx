import { useState } from 'react';
import { Select } from 'uilib';
import { OPTIONS } from 'helpers';

export default () => {
  const [value, setValue] = useState(OPTIONS[0].id);

  return (
    <Select
      label="Lorem Ipsum"
      options={OPTIONS}
      value={value}
      onChange={val => setValue(val)}
    />
  );
};
