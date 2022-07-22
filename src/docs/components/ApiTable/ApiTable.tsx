import React, { useCallback } from 'react';

import { Scroll } from 'uilib/components';

import S from './ApiTable.styl';

export function ApiTable({ types }) {
  const renderValue = useCallback((name, data) => {
    if (name === 'extends') return data.join(' & ');
    return data.value;
  }, []);

  return (
    <Scroll
      x
      y
      className={S.root}
      offset={{
        y: { before: 60, after: 20 },
        x: { before: 20, after: 20 },
      }}
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
          {Object.entries(types)?.map(([name, params]) => {
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
