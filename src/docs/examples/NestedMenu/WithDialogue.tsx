import { Button, Dialogue, NestedMenu } from 'uilib';

import { useState } from 'react';

export default () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <NestedMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        trigger={
          <Button size="s" round>
            Menu
          </Button>
        }
        items={[
          {
            id: 'settings',
            label: 'Open dialogue',
            onClick: () => setDialogueOpen(true),
          },
        ]}
      />
      <Dialogue
        open={dialogueOpen}
        onOpenChange={setDialogueOpen}
        title="Opened from menu"
        subtitle="Should stay open on mobile after tapping the menu item"
        content="Tap the menu item on a touch device: this dialogue must not close by itself."
        footer={<Button onClick={() => setDialogueOpen(false)}>Close</Button>}
      />
    </div>
  );
};
