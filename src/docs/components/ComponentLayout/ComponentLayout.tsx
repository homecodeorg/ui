import { Tabs } from 'uilib/components';

import S from './ComponentLayout.styl';

type Props = {
  name: string;
  api: React.ReactNode;
  code: React.ReactNode;
};

export function ComponentLayout({ name, api, code }: Props) {
  return (
    <div className={S.root}>
      <Tabs
        items={[
          { id: 'api', label: 'API', content: api },
          { id: 'demo', label: 'Demo', content: code },
        ]}
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
