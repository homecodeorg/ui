import { useMemo, useState } from 'react';
import { Autocomplete, Menu } from 'uilib';

const PAGE_SIZE = 20;
const TOTAL_ITEMS = 200; // Large dataset to demonstrate pagination

// Simulate a large dataset
const allItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: String(i + 1),
  label: `Option ${i + 1}`,
}));

/**
 * getOptions handles pagination automatically:
 * - Called with (filter, offset) when user types or scrolls to end
 * - Should return Promise<{items: Option[], total?: number}> with pageSize items
 * - Autocomplete will call this again with increased offset when scrolling reaches the end
 */
const getOptions = (filter, offset) => {
  return new Promise(resolve => {
    console.log('getOptions', filter, offset);
    setTimeout(() => {
      // Filter items based on search query
      const filtered = allItems.filter(item =>
        item.label.toLowerCase().includes(filter.toLowerCase())
      );

      // Return paginated slice
      const paginated = filtered.slice(offset, offset + PAGE_SIZE);

      resolve({
        items: paginated,
        total: filtered.length,
      });
    }, 1500); // Simulate API delay
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
      placeholder="Type to search or scroll down to load more..."
      renderItem={({
        option,
        className,
        style,
        focused,
        onClick,
        onMouseEnter,
      }) => (
        <Menu.Item
          className={className}
          style={{ ...style, height: '40px' }}
          focused={focused}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
        >
          {option.label}
        </Menu.Item>
      )}
    />
  );
};
