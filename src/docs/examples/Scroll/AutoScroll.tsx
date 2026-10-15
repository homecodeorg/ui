import { useEffect, useRef, useState } from 'react';
import { LOREM_IPSUM_LONG, getLongText } from 'helpers';

import { Button, Scroll } from 'uilib';

const WORDS = LOREM_IPSUM_LONG.split(' ');

// Pieces of text arrive with irregular size and timing, like an LLM stream
const getChunk = () => {
  const count = 1 + Math.round(Math.random() * 6);
  const start = Math.round(Math.random() * (WORDS.length - count));
  return ` ${WORDS.slice(start, start + count).join(' ')}`;
};

export default () => {
  const [blocks, setBlocks] = useState([LOREM_IPSUM_LONG]);
  const [isStreaming, setIsStreaming] = useState(false);
  const timerRef = useRef(null);

  const addBlock = (text = '') => setBlocks(prev => [...prev, text]);
  const appendToLast = text =>
    setBlocks(prev => [...prev.slice(0, -1), prev[prev.length - 1] + text]);

  useEffect(() => {
    if (!isStreaming) return;

    let chunks = 0;
    const tick = () => {
      appendToLast(getChunk());
      // new paragraph from time to time
      if (++chunks % 40 === 0) addBlock();
      // random pauses longer than AUTO_SCROLL_TIMEOUT reset the speed delta
      const pause = Math.random() < 0.05 ? 600 : 20 + Math.random() * 80;
      timerRef.current = setTimeout(tick, pause);
    };

    addBlock();
    tick();

    return () => clearTimeout(timerRef.current);
  }, [isStreaming]);

  return (
    <>
      <div className={S.controls}>
        <Button
          variant={isStreaming ? 'primary' : 'default'}
          onClick={() => setIsStreaming(!isStreaming)}
        >
          {isStreaming ? 'Stop stream' : 'Start stream'}
        </Button>
        <Button onClick={() => addBlock(getLongText(1))}>
          Add block
        </Button>
        <Button onClick={() => addBlock(getLongText(6))}>
          Add huge block
        </Button>
      </div>
      <Scroll
        y
        autoScroll
        fadeSize="m"
        className={cn(S.example, S.autoScrollExample)}
        innerClassName={S.inner}
      >
        {blocks.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </Scroll>
    </>
  );
};
