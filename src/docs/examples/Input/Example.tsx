import { useState } from 'react';
import { Input } from 'uilib';

export default () => {
  const [value, setValue] = useState(`Ask Alice, I think she know`);

  return (
    <Input
      size="m"
      // variant="outlined"
      type="textarea"
      label="Textarea example label"
      value={value}
      onChange={(e, val) => setValue(val)}
      hasClear
    />
  );
};
