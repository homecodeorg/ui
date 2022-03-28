import { useState } from 'react';
import { Input } from 'uilib';

export default () => {
  const [value, setValue] = useState('Alice');

  return (
    <Input
      type="textarea"
      value={value}
      onChange={(e, val) => setValue(val)}
      hasClear
      size="m"
    />
  );
};
