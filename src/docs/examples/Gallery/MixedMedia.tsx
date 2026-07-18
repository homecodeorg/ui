import { useState } from 'react';
import { Button, LightBox, Gallery } from 'uilib';

const { getRandomImageUrl } = helpers;

const DEMO_VIDEO_SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

const items = [
  getRandomImageUrl(),
  { src: DEMO_VIDEO_SRC, kind: 'video' as const },
  getRandomImageUrl(),
];

export default () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open mixed media gallery</Button>
      <LightBox isOpen={isOpen} onClose={() => setOpen(false)} blur>
        {isOpen && (
          <Gallery
            items={items}
            showArrows
            showDots
            animation
            style={{ height: 400 }}
          />
        )}
      </LightBox>
    </>
  );
};
