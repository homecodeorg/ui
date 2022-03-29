import { useState } from 'react';
import { Input } from 'uilib';

export default () => {
  const [value, setValue] = useState(`Ask Alice, I think she know`);

  return (
    <Input
      type="textarea"
      label="Textar eaxample label"
      value={value}
      onChange={(e, val) => setValue(val)}
      hasClear
      size="m"
    />
  );
};
