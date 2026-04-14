import { useState } from 'react';

import { Button, Dialogue } from 'uilib';

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialogue
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Open dialogue</Button>}
      title="Dialogue"
      subtitle="Modal built on Card with focus trap and scrollable content."
      content={
        <p style={{ margin: 0 }}>
          Overlay click or Escape closes the dialogue. Body scroll is locked
          while open.
        </p>
      }
      footer={
        <Button variant="primary" onClick={() => setOpen(false)}>
          Close
        </Button>
      }
    />
  );
};
