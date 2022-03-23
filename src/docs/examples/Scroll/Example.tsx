import { getLongText } from 'helpers';

import { Scroll } from 'uilib';

export default () => (
  <Scroll
    x
    y
    style={{
      height: 200,
      width: 200,
      color: `var(--accent-color-alpha-100)`,
    }}
    offset={{
      x: { after: 20 },
      y: { before: 50, after: 20 },
    }}
  >
    <div style={{ width: 1000 }}>{getLongText(5)}</div>
  </Scroll>
);
