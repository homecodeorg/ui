import { useState } from 'react';
import { Button, EmojiSelector, Popup } from 'uilib';

export default () => {
  const [picked, setPicked] = useState<string[]>([]);
  const [isOpen, setOpen] = useState(false);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Popup
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        blur
        round
        elevation={2}
        direction="bottom-left"
        trigger={
          <Button size="m" onClick={() => setOpen(!isOpen)}>
            React
          </Button>
        }
        content={
          <EmojiSelector
            selected={picked}
            onSelect={emoji => {
              setPicked(list =>
                list.includes(emoji)
                  ? list.filter(e => e !== emoji)
                  : [...list, emoji]
              );
              setOpen(false);
            }}
          />
        }
      />
      <span style={{ fontSize: 24 }}>{picked.join(' ')}</span>
    </div>
  );
};
