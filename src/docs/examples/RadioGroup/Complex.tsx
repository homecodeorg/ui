import { useState } from 'react';
import { RadioButton, RadioGroup } from 'uilib';

export default () => {
  const [value, setValue] = useState('yes');

  return (
    <RadioGroup
      label="Confirm"
      value={value}
      onChange={setValue}
      orientation="horizontal"
      disabled
      size="s"
      variant="outlined"
    >
      <RadioButton value="yes" label="Yes" />
      <RadioButton value="no" label="No" />
    </RadioGroup>
  );
};
