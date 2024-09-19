import { useState } from 'react';
import { IconButton } from 'uilib';

export default () => {
  const size = 'l';
  const [count, setCount] = useState(0);

  return (
    <>
      <IconButton type="plus" size={size} onClick={() => setCount(count + 1)} />
      {count}
    </>
  );
};
