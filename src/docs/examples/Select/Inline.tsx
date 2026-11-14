import { useState } from 'react';
import { Select2 } from 'uilib';
import { OPTIONS } from 'helpers';

export default () => {
  const [value, setValue] = useState(OPTIONS[11].id);

  return (
    <Select2
      inline
      isSearchable
      round
      label="Search"
      options={OPTIONS}
      value={value}
      onChange={next => next !== null && setValue(next)}
    />
  );
};
