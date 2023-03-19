import { useState, useCallback } from 'react';
import { Button, LightBox, Gallery } from 'uilib';

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
  const [index, setIndex] = useState(0);
  const open = useCallback(index => {
    setIndex(index);
    setOpen(true);
  }, []);

  return (
    <>
      {items.map((item, i) => (
        <Button
          varinat="clear"
          className={S.gridItem}
          key={i}
          onClick={() => open(i)}
        >
          <img src={item} alt="" />
        </Button>
      ))}
      <LightBox isOpen={isOpen} onClose={() => setOpen(false)} blur>
        <Gallery items={items} startIndex={index} onChange={setIndex} />
      </LightBox>
    </>
  );
};
