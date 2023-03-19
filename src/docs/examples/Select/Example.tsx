import { useState } from 'react';
import { Select } from 'uilib';
import { OPTIONS } from 'helpers';

export default () => {
  const [value, setValue] = useState([OPTIONS[2].id]);

  return (
    <Select
      // variant="outlined"
      // popupProps={{ direction: 'top' }}
      // isSearchable
      blur
      label="Label"
      options={OPTIONS}
      value={value}
      onChange={val => setValue(val)}
    />
  );
};
