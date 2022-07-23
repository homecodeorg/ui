import { Tabs } from 'uilib/components';

import S from './ComponentLayout.styl';

type Props = {
  name: string;
  api: React.ReactNode;
  code: React.ReactNode;
};

let activeTabId = 'demo';

export function ComponentLayout({ name, api, code }: Props) {
  return (
    <div className={S.root}>
      <Tabs
        items={[
          {
            id: 'api',
            label: 'API',
            content: api,
            contentClassName: S.content,
            forceRender: true,
          },
          { id: 'demo', label: 'Demo', content: code, forceRender: true },
        ]}
        activeId={activeTabId}
        onChange={id => (activeTabId = id)}
        children={({ tabs, content }) => (
          <>
            <div className={S.header}>
              <h1>{name}</h1>
              {tabs}
            </div>
            {content}
          </>
        )}
      />
    </div>
  );
}
