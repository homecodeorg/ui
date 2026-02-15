import { useState } from 'react';
import { Autocomplete } from 'uilib';

const PAGE_SIZE = 20;
const allItems = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  label: `Option ${i + 1}`,
}));

const getOptions = (filter, offset) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const filtered = allItems.filter(item =>
        item.label.toLowerCase().includes(filter.toLowerCase())
      );
      const paginated = filtered.slice(offset, offset + PAGE_SIZE);
      resolve(paginated);
    }, 500);
  });
};

export default () => {
  const [value, setValue] = useState('');

  return (
    <Autocomplete
      value={value}
      onChange={(_, val) => setValue(val)}
      onSelect={option => setValue(option.label)}
      getOptions={getOptions}
      items={allItems}
      pageSize={PAGE_SIZE}
      placeholder="Type to search or scroll for more..."
    />
  );
};
