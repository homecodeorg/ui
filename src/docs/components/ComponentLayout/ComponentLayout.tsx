import React from 'react';
import cn from 'classnames';

import { Code } from 'docs/components';
import { Tabs, Scroll } from 'uilib/components';

import TYPES from '../../types.json';

import S from './ComponentLayout.styl';

function API({ name }) {
  return (
    <Scroll y className={S.api} offset={{ y: { before: 50, after: 20 } }}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            {/* <th>Description</th> */}
          </tr>
        </thead>
        <tbody>
          {TYPES[name]?.map(({ name, type }) => {
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{type}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Scroll>
  );
}

export function ComponentLayout({ name, code }) {
  return (
    <div className={S.root}>
      <Tabs
        className={S.content}
        items={[
          { id: 'api', label: 'API', content: () => <API name={name} /> },
          { id: 'demo', label: 'Demo', content: () => <Code code={code} /> },
        ]}
        children={({ tabs, content }) => (
          <>
            <div className={cn(S.header, S.headerFade)}>
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
