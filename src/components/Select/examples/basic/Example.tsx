import { useState } from 'react';
import { generateOptions } from './select-helpers';
import { Select } from '@foreverido/uilib';

const OPTIONS = generateOptions();

export default function Example() {
  const [value, setValue] = useState(OPTIONS[0].id);

  return (
    <Select
      label="Lorem Ipsum"
      options={OPTIONS}
      value={value}
      onChange={value => setValue(value)}
    />
  );
}
