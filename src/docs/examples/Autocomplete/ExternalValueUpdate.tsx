import { useMemo, useState } from 'react';
import { Autocomplete, Button, Menu } from 'uilib';

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
    }, 300);
  });
};

export default () => {
  const [value, setValue] = useState('Option 5');
  const defaultOptions = useMemo(() => allItems.slice(0, PAGE_SIZE), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="s" onClick={() => setValue('Option 1')}>
          Set "Option 1"
        </Button>
        <Button size="s" onClick={() => setValue('Option 10')}>
          Set "Option 10"
        </Button>
        <Button size="s" onClick={() => setValue('External Title Update')}>
          Set custom title
        </Button>
      </div>
      <Autocomplete
        items={defaultOptions}
        value={value}
        onChange={(_, val) => setValue(val)}
        getOptions={getOptions}
        pageSize={PAGE_SIZE}
        selectable
        defaultSelected="5"
        scrollToSelected
        placeholder="Select or type..."
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
    </div>
  );
};
