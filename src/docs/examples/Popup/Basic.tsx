import { useCallback, useState } from 'react';
import { Popup, Button } from 'uilib';

export default () => {
  const [isOpen, setOpen] = useState(true);
  const toggle = useCallback(() => setOpen(!isOpen), [isOpen]);
  const size = 'm';

  return (
    <div className={S.root}>
      <Popup
        isOpen={isOpen}
        size={size}
        // hoverControl
        // focusControl
        direction="top"
        trigger={
          <Button size={size} onClick={toggle}>
            Open Popup
          </Button>
        }
        content={<div style={{ padding: 10 }}>Popup content</div>}
      />
    </div>
  );
};
