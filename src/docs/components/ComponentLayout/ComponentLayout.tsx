import React, { useCallback } from 'react';
import cn from 'classnames';

import { Code } from 'docs/components';
import { Tabs, Scroll } from 'uilib/components';

import TYPES from '../../types.json';

import S from './ComponentLayout.styl';

console.log('TYPES', TYPES);

function API({ name }) {
  const renderValue = useCallback((name, data) => {
    if (name === 'extends') return data.join(' & ');
    return data.value;
  }, []);

  return (
    <Scroll
      x
      y
      className={S.api}
      offset={{ y: { before: 60, after: 20 }, x: { before: 20, after: 20 } }}
    >
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(TYPES[name]?.Props)?.map(([name, params]) => {
            if (name === 'kind') return null;

            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{renderValue(name, params)}</td>
                <td>{params.comment}</td>
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
