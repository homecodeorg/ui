import { Button, NestedMenu } from 'uilib';

import { useState } from 'react';

const THREADS = Array.from({ length: 30 }, (_, i) => `Thread #${i + 1}`);

export default () => {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState('Pick a thread');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <NestedMenu
        open={open}
        onOpenChange={setOpen}
        align="start"
        searchable
        searchPlaceholder="Search threads"
        trigger={
          <Button size="s" round>
            {THREADS.length} threads
          </Button>
        }
        items={THREADS.map(title => ({
          id: title,
          label: title,
          onClick: () => setLast(title),
        }))}
      />
      <div style={{ opacity: 0.6, fontSize: 13 }}>{last}</div>
    </div>
  );
};
