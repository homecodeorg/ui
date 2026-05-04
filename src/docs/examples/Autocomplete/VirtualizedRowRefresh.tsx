import { useCallback, useMemo, useState } from 'react';
import { Autocomplete, Menu, Toggle } from 'uilib';

const PAGE_SIZE = 20;
const TOTAL_ITEMS = 80;
const ITEM_HEIGHT = 40;

const allItems = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: String(i + 1),
  label: `Option ${i + 1}`,
}));

const getOptions = (filter, offset) =>
  new Promise(resolve => {
    setTimeout(() => {
      const filtered = allItems.filter(item =>
        item.label.toLowerCase().includes(filter.toLowerCase())
      );
      resolve({
        items: filtered.slice(offset, offset + PAGE_SIZE),
        total: filtered.length,
      });
    }, 150);
  });

export default () => {
  const [value, setValue] = useState('');
  const [toggledById, setToggledById] = useState({});
  const defaultOptions = useMemo(() => allItems.slice(0, PAGE_SIZE), []);

  const renderItem = useCallback(
    ({
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
        style={{ ...style, height: ITEM_HEIGHT }}
        selected={isSelected}
        focused={focused}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            width: '100%',
            minWidth: 0,
          }}
        >
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {option.label}
          </span>
          <span
            style={{ flexShrink: 0 }}
            onClick={e => {
              e.stopPropagation();
            }}
            onMouseDown={e => {
              e.stopPropagation();
            }}
          >
            <Toggle
              size="s"
              checked={Boolean(toggledById[option.id])}
              onChange={e => {
                e.stopPropagation();
                const nextChecked = e.currentTarget.checked;
                setToggledById(prev => {
                  const next = { ...prev };
                  if (nextChecked) next[option.id] = true;
                  else delete next[option.id];
                  return next;
                });
              }}
            />
          </span>
        </span>
      </Menu.Item>
    ),
    [toggledById]
  );

  return (
    <div>
      <p>
        Open the menu and use the row switch — it should flip right away without
        closing the list or leaving stale rows (virtualized repaint when{' '}
        <code>renderItem</code> updates).
      </p>
      <Autocomplete
        items={defaultOptions}
        value={value}
        onChange={(_, val) => setValue(val)}
        getOptions={getOptions}
        itemHeight={ITEM_HEIGHT}
        pageSize={PAGE_SIZE}
        selectable
        defaultSelected="1"
        placeholder="Focus to open…"
        renderItem={renderItem}
      />
    </div>
  );
};
