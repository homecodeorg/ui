import { useState } from 'react';
import { LightBox, Button, Gallery } from 'uilib';

const { getRandomImageUrl } = helpers;
const items = [
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
];

export default () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {`<LightBox />`}</Button>
      <LightBox isOpen={isOpen} onClose={() => setOpen(false)}>
        <Gallery items={items} style={{ height: 400 }} />
      </LightBox>
    </>
  );
};
