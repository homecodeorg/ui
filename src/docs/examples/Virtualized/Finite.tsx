import { Component, useEffect } from 'react';
import { VirtualizedList, uid } from 'uilib';
import { createStore } from 'justorm';
import { useStore } from 'justorm/react';

const { getSimpleItemData, renderSimpleItems, loadData } = helpers;

const PAGE_SIZE = 20;
const totalCount = 100;
const store = createStore('example', { data: {} });
let updateId = uid.generateUID(); // update to fire render items, bcz itemsCount === totalCount

const loadNextData = (first, last) => loadData(first, last, getSimpleItemData);

function setData(nextData, startIndex = Object.keys(store.data).length) {
  const data = { ...store.data.originalObject };

  nextData.every((item, i) => {
    const index = startIndex + i;
    if (index > totalCount) return false;
    data[index] = item;
    return true;
  });

  store.data = data;
}

export default function Example() {
  const {
    example: { data },
  } = useStore({ example: ['data'] });

  console.log(data);

  useEffect(() => {
    updateId = uid.generateUID();
    loadNextData(0, PAGE_SIZE).then(setData);
  }, []);

  const onScroll = ({ first, last }) => {
    updateId = uid.generateUID();
    const currId = updateId;

    loadNextData(first, last).then(nextData => {
      if (currId !== updateId) return;
      setData(nextData, first);
    });
  };

  return (
    <VirtualizedList
      className={S.root}
      id={updateId}
      totalCount={totalCount}
      itemsCount={totalCount}
      overlapCount={10}
      itemHeight={40}
      renderItem={itemProps =>
        renderSimpleItems(itemProps, data[itemProps.key])
      }
      onScroll={onScroll}
    />
  );
}
