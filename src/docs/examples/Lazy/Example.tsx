// NOTE: Example simulate low network speed
import { Lazy, Tabs } from 'uilib';

export default () => (
  <Tabs
    items={[
      {
        id: 'lazy1',
        label: 'Lazy 1',
        content: (
          <Lazy
            loader={() => import('../Button')}
            progressElem="Loading..."
          />
        ),
      },
      {
        id: 'lazy2',
        label: 'Lazy 2',
        content: (
          <Lazy
            loader={() => import('../Tabs/Example')}
            progressElem="Loading..."
          />
        ),
      },
    ]}
  />
);
