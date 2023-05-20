import { useState } from 'react';
import { InputFile } from 'uilib';

export default () => {
  const [value, setValue] = useState(null);

  return (
    <InputFile
      size="m"
      //variant="outlined"
      label="Photo"
      value={value}
      onChange={(e, val) => setValue(val)}
      upload={upload}
      accept="image/png, image/jpeg"
    />
  );
};
