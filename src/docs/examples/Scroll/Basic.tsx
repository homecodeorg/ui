import { getLongText } from 'helpers';
import { useEffect, useState } from 'react';

import { Scroll } from 'uilib';

export default () => {
  const [text, setText] = useState(getLongText(5));

  useEffect(() => {
    setText(text + getLongText(5));
  }, []);

  return (
    <Scroll
      x
      y
      className={S.example}
      offset={{
        x: { after: 20 },
        y: { before: 50, after: 20 },
      }}
    >
      <div style={{ width: 1000 }}>{getLongText(5)}</div>
    </Scroll>
  );
};
