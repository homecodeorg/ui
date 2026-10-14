import { useState } from 'react';
import { Chip } from 'uilib';

export default () => {
  const [selected, setSelected] = useState({});

  return ['xs', 's', 'm', 'l', 'xl'].map(size => (
    <div key={size} className={S.row}>
      <Chip size={size}>{size}</Chip>
      <Chip
        size={size}
        selected={selected[size]}
        onClick={() => setSelected({ ...selected, [size]: !selected[size] })}
      >
        selectable
      </Chip>
      <Chip size={size} onRemove={() => {}}>
        removable
      </Chip>
    </div>
  ));
};
