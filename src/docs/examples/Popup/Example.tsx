import { useCallback, useState } from 'react';
import { Popup, Button } from 'uilib';

export default () => {
  const [isOpen, setOpen] = useState(true);
  const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);
  const size = 'm';

  return (
    <Popup
      isOpen={isOpen}
      size={size}
      controllable
      direction="bottom"
      trigger={
        <Button size={size} onClick={toggle}>
          Open Popup
        </Button>
      }
      content={<div style={{ padding: 10 }}>Popup content</div>}
    />
  );
};
