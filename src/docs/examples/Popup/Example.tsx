import { useCallback, useState } from 'react';
import { Popup, Button } from 'uilib';

export default () => {
  const [isOpen, setOpen] = useState(true);
  const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);

  return (
    <Popup
      isOpen={isOpen}
      controllable
      direction="bottom"
      trigger={<Button onClick={toggle}>Open Popup</Button>}
      content={<div style={{ padding: 20 }}>Popup content</div>}
    />
  );
};
