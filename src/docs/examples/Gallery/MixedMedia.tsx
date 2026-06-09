import { useState } from 'react';
import { Button, LightBox, Gallery } from 'uilib';

const { getRandomImageUrl } = helpers;

const items = [
  getRandomImageUrl(),
  {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
    kind: 'video',
  },
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
