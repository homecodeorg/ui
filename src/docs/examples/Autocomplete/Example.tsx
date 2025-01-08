import { useState } from 'react';
import { Autocomplete } from 'uilib';

const getOptions = value => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: '1', label: `${value} option 1` },
        { id: '2', label: `${value} option 2` },
        { id: '3', label: `${value} option 3` },
      ]);
    }, 1000);
  });
};

export default () => {
  const [value, setValue] = useState('');

  return (
    <Autocomplete
      value={value}
      onChange={setValue}
      onSelect={setValue}
      getOptions={getOptions}
      placeholder="Type to search..."
    />
  );
};
