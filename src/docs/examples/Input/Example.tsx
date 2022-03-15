import { useState } from 'react';
import { Input } from 'uilib';

export default () => {
  const [value, setValue] = useState('Alice');

  return <Input value={value} onChange={(e, val) => setValue(val)} hasClear />;
};
