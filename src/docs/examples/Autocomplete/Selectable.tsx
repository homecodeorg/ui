import { useMemo, useState } from 'react';
import { Autocomplete, Menu } from 'uilib';

const PAGE_SIZE = 20;
const TOTAL_ITEMS = 200;

const allItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: String(i + 1),
  label: `Option ${i + 1}`,
}));

const getOptions = (filter, offset) => {
  console.log('getOptions', filter, offset);
  return new Promise(resolve => {
    setTimeout(() => {
      const filtered = allItems.filter(item =>
        item.label.toLowerCase().includes(filter.toLowerCase())
      );
      const paginated = filtered.slice(offset, offset + PAGE_SIZE);
      resolve({ items: paginated, total: filtered.length });
    }, 500);
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
      getOptions={getOptions}
      pageSize={PAGE_SIZE}
      selectable
      placeholder="Type to search..."
      renderItem={({
        option,
        isSelected,
        className,
        style,
        focused,
        onClick,
        onMouseEnter,
      }) => (
        <Menu.Item
          className={className}
          style={{
            ...style,
            height: '40px',
            ...(isSelected && {
              backgroundColor: 'var(--active-color-alpha-500)',
              fontWeight: 600,
            }),
          }}
          selected={isSelected}
          focused={focused}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
        >
          {option.label}
          {isSelected && ' ✓'}
        </Menu.Item>
      )}
    />
  );
};
