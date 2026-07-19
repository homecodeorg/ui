import { useState, useCallback } from 'react';
import { Button, GridLayout, LightBox, Gallery } from 'uilib';

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
      <GridLayout colWidth={100} gap="var(--p-3)">
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
      </GridLayout>
      <LightBox isOpen={isOpen} onClose={() => setOpen(false)} blur>
        <Gallery items={items} startIndex={index} onChange={setIndex} />
      </LightBox>
    </>
  );
};
