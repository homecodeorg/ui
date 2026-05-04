import { useState } from 'react';
import { Popup, Button } from 'uilib';
import S from './Popup.styl';

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={S.wideShiftDemo}>
      <p className={S.wideShiftHint}>
        Small trigger aligned left — wide menu extends left from{' '}
        <code>bottom-left</code>. Shift margins keep it inside the viewport /
        overlay.
      </p>
      <div className={S.wideShiftRow}>
        <Popup
          animated={false}
          direction="bottom-left"
          isOpen={open}
          onClose={() => setOpen(false)}
          trigger={
            <Button size="s" onClick={() => setOpen(o => !o)}>
              Menu
            </Button>
          }
          content={
            <div className={S.widePopupPanel}>
              This panel is much wider than the button. Resize the window — the
              popup should slide horizontally (and vertically if needed) instead
              of clipping at the viewport edge.
            </div>
          }
        />
      </div>
    </div>
  );
};
