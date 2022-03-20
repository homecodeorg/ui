import { useState } from 'react';
import { InputFile } from 'uilib';

export default () => {
  const [value, setValue] = useState([]);

  return (
    <InputFile
      label="Photos"
      value={value}
      onChange={(e, val) => setValue(val)}
      // @ts-ignore
      upload={upload}
      maxCount={5}
      accept="image/png, image/jpeg"
    />
  );
};
