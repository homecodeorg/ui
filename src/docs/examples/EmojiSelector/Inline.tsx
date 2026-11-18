import { useState } from 'react';
import { EmojiSelector } from 'uilib';

export default () => {
  const [last, setLast] = useState('');

  return (
    <div>
      <EmojiSelector autoFocus={false} onSelect={setLast} />
      <p>Picked: {last}</p>
    </div>
  );
};
