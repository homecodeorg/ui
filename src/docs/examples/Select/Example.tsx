import { useEffect, useState } from 'react';
import { Select } from 'uilib';
import { OPTIONS } from 'helpers';

export default () => {
  const [value, setValue] = useState([OPTIONS[2].id]);

  useEffect(() => {
    setTimeout(() => {
      setValue(`Ask Alice, I think she know`);
    }, 5000);
  }, []);

  return (
    <Select
      // variant="outlined"
      // popupProps={{ direction: 'top' }}
      isSearchable
      blur
      label="Label"
      options={OPTIONS}
      searchValue={value}
      onChange={val => setValue(val)}
    />
  );
};
