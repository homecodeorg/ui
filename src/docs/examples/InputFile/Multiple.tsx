import { useState } from 'react';
import { InputFile } from 'uilib';

const { getRandomImageUrl } = helpers;
const initialValue = [
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
];

export default () => {
  const [value, setValue] = useState(initialValue);

  return (
    <InputFile
      size="m"
      // variant="outlined"
      label="Photos"
      draggable
      value={value}
      onChange={(e, val) => setValue(val)}
      upload={upload}
      maxCount={5}
      accept="image/png, image/jpeg"
    />
  );
};
