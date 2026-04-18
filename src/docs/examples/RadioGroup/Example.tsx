import { useState } from 'react';
import { RadioButton, RadioGroup } from 'uilib';

export default () => {
  const [value, setValue] = useState('b');

  return (
    <RadioGroup
      label="Choose one"
      value={value}
      onChange={setValue}
      size="m"
    >
      <RadioButton value="a" label="Option A" />
      <RadioButton value="b" label="Option B" />
      <RadioButton value="c" label="Option C" />
    </RadioGroup>
  );
};
