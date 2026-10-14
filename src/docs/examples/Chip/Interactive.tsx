import { useState } from 'react';
import { Chip } from 'uilib';

const ALL = ['React', 'Vue', 'Svelte', 'Solid'];

export default () => {
  const [items, setItems] = useState(ALL);
  const [selected, setSelected] = useState(['Vue']);

  const toggle = item =>
    setSelected(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );

  return (
    <>
      <p>Plain chip: no `onClick`, so it is static (no hover, no pointer).</p>
      <Chip>Static</Chip>

      <p>Clickable chips: `onClick` toggles `selected`.</p>
      <div className={S.row}>
        {ALL.map(item => (
          <Chip
            key={item}
            selected={selected.includes(item)}
            onClick={() => toggle(item)}
          >
            {item}
          </Chip>
        ))}
      </div>

      <p>Removable chips: `onRemove` adds the remove button.</p>
      <div className={S.row}>
        {items.map(item => (
          <Chip
            key={item}
            removeTooltip="Remove"
            onRemove={() => setItems(items.filter(i => i !== item))}
          >
            {item}
          </Chip>
        ))}
        {!items.length && (
          <Chip onClick={() => setItems(ALL)}>Restore</Chip>
        )}
      </div>
    </>
  );
};
