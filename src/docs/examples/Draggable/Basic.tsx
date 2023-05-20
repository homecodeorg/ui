import { useState } from 'react';
import { Draggable } from 'uilib';

const ids = Array.from({ length: 5 }, (_, i) => String(i + 1));

export default () => {
  const [items, setItems] = useState(ids);

  return (
    <Draggable
      items={items}
      itemClassName={S.item}
      onChange={setItems}
      renderItem={id => <>Item {id}</>}
    />
  );
};
