import { Tabs } from 'uilib/components';
import { LS } from 'uilib/tools';

import S from './ComponentLayout.styl';

type Props = {
  name: string;
  api: React.ReactNode;
  code: React.ReactNode;
};

let activeTabId = LS.get('component-layout-tab') || 'demo';

function setActiveTab(id) {
  activeTabId = id;
  LS.set('component-layout-tab', id);
}

export function ComponentLayout({ name, api, code }: Props) {
  return (
    <div className={S.root}>
      <Tabs
        contentClassName={S.content}
        items={[
          {
            id: 'api',
            label: 'API',
            content: api,
            contentClassName: S.api,
            forceRender: true,
          },
          { id: 'demo', label: 'Demo', content: code, forceRender: true },
        ]}
        activeId={activeTabId}
        onChange={setActiveTab}
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
