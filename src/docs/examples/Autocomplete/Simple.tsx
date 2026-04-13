import { useMemo, useState } from 'react';
import { Autocomplete } from 'uilib';

const PAGE_SIZE = 20;
const TOTAL_ITEMS = 50;

const allItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: String(i + 1),
  label: `Option ${i + 1}`,
}));

const getOptions = (filter, offset) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const filtered = filter
        ? allItems.filter(item =>
            item.label.toLowerCase().includes(filter.toLowerCase())
          )
        : allItems;
      const paginated = filtered.slice(offset, offset + PAGE_SIZE);
      resolve({ items: paginated, total: filtered.length });
    }, 200);
  });
};

export default () => {
  const [value, setValue] = useState('');
  const defaultOptions = useMemo(() => allItems.slice(0, PAGE_SIZE), []);

  return (
    <Autocomplete
      items={defaultOptions}
      value={value}
      onChange={(_, val) => setValue(val)}
      onSelect={option => setValue(option.label)}
      getOptions={getOptions}
      pageSize={PAGE_SIZE}
      inputProps={{ placeholder: 'Type to search...' }}
    />
  );
};
