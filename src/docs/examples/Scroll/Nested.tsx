import { useEffect, useState } from 'react';
import { getLongText } from 'helpers';

import { Scroll } from 'uilib';

const offset = {
  x: { before: 20, after: 20 },
  y: { before: 20, after: 20 },
};

export default () => {
  const [text, setText] = useState(getLongText(5));

  useEffect(() => {
    setText(text + getLongText(5));
  }, []);

  return (
    <Scroll x y className={S.example} offset={offset}>
      <Scroll className={cn(S.example, S.innerScroll)} x y offset={offset}>
        <div style={{ width: 1000 }}>{getLongText(15)}</div>
      </Scroll>
    </Scroll>
  );
};
