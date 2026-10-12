import { useState } from 'react';
import { Chip } from 'uilib';

const sizes = ['xs', 's', 'm', 'l', 'xl'];

const buildChips = () =>
  sizes.flatMap(size => [
    { id: `${size}-plain`, size, label: size, selected: false, removable: false },
    {
      id: `${size}-selected`,
      size,
      label: 'selected',
      selected: true,
      removable: false,
    },
    {
      id: `${size}-remove`,
      size,
      label: 'removable',
      selected: false,
      removable: true,
    },
  ]);

export default () => {
  const [chips, setChips] = useState(buildChips);

  return sizes.map(size => (
    <div key={size} className={S.row}>
      {chips
        .filter(chip => chip.size === size)
        .map(chip => (
          <Chip
            key={chip.id}
            size={chip.size}
            selected={chip.selected}
            onClick={() =>
              setChips(prev =>
                prev.map(item =>
                  item.id === chip.id
                    ? { ...item, selected: !item.selected }
                    : item
                )
              )
            }
            onRemove={
              chip.removable
                ? () => setChips(prev => prev.filter(item => item.id !== chip.id))
                : undefined
            }
            removeTooltip={chip.removable ? 'Remove' : undefined}
          >
            {chip.label}
          </Chip>
        ))}
    </div>
  ));
};
