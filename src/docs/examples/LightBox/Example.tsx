import { useState } from 'react';
import { LightBox, Button, Gallery } from 'uilib';

const { getRandomImageUrl } = helpers;

const DEMO_VIDEO_SRC =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

const items = [
  getRandomImageUrl(),
  getRandomImageUrl(),
  { src: DEMO_VIDEO_SRC, kind: 'video' as const },
  getRandomImageUrl(),
  getRandomImageUrl(),
];

export default () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open LightBox</Button>
      <LightBox isOpen={isOpen} onClose={() => setOpen(false)} blur>
        <Gallery items={items} showArrows showDots style={{ height: 400 }} />
      </LightBox>
    </>
  );
};
