import { useEffect, useState } from 'react';
import { Select2 } from 'uilib';
import { OPTIONS } from 'helpers';

export default () => {
  const [value, setValue] = useState([OPTIONS[2].id]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setSearchValue(`Ask Alice, I think she know`);
    }, 5000);
  }, []);

  return (
    <Select2
      // variant="outlined"
      // popupProps={{ direction: 'top' }}
      isSearchable
      blur
      label="Label"
      options={OPTIONS}
      value={value}
      searchValue={searchValue}
      onChange={setValue}
      onSearchChange={setSearchValue}
    />
  );
};
