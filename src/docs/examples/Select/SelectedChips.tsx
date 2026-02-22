import { useState } from 'react';
import { Select2 } from 'uilib';
import { OPTIONS } from 'helpers';

export default () => {
  const [value, setValue] = useState([OPTIONS[0].id, OPTIONS[1].id, OPTIONS[2].id]);
  const [selectedChipIds, setSelectedChipIds] = useState([OPTIONS[1].id]);

  return (
    <Select2
      isSearchable
      label="Label"
      options={OPTIONS}
      value={value}
      onChange={setValue}
      selectedChipIds={selectedChipIds}
      onChipClick={id =>
        setSelectedChipIds(prev =>
          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
      }
    />
  );
};
