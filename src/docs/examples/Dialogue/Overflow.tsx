import { useState } from 'react';

import { Button, Dialogue } from 'uilib';

const LINK =
  'https://tournament.apostol.space/app/t/cmwfa5u8o0002l0h7v6d3grfe/join';

const glowBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 200,
  borderRadius: 24,
  backgroundColor: 'var(--decent-color)',
  boxShadow:
    '0 0 0 2px var(--active-color), 0 0 24px 4px var(--active-color-alpha-500)',
};

const focusRing = {
  outline: '2px solid var(--active-color)',
  outlineOffset: 4,
};

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialogue
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Open overflowing dialogue</Button>}
      title="Join the pool"
      size="login"
      content={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Glow and shadow are drawn outside the box: they stay visible */}
          <div style={glowBox}>QR code</div>

          <p style={{ margin: 0 }}>
            Point a phone camera here to join the pool.
          </p>

          {/* A long unbreakable string wraps instead of overflowing */}
          <a
            href={LINK}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--active-color)' }}
          >
            {LINK}
          </a>

          {/* The focus ring sits outside the button and is not clipped */}
          <Button style={focusRing}>Focused button</Button>

          {/* Tall content scrolls to the dialogue's edges */}
          {Array.from({ length: 8 }, (_, i) => (
            <p key={i} style={{ margin: 0 }}>
              Paragraph {i + 1}. Scroll the dialogue body: it fades out at the
              very edge of the dialogue, not inside an inset box.
            </p>
          ))}
        </div>
      }
      footer={
        <Button variant="primary" onClick={() => setOpen(false)}>
          Copy link
        </Button>
      }
    />
  );
};
