import { Component } from 'react';
import { VirtualizedListScroll, VirtualizedList, array, uid } from 'uilib';
import { createStore, withStore } from 'justorm/react';

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

export default withStore('example')(
  class Example extends Component {
    componentDidMount() {
      updateId = uid.generateUID();
      loadNextData(0, PAGE_SIZE).then(setData);
    }

    onScroll({ first, last }) {
      updateId = uid.generateUID();
      const currId = updateId;

      loadNextData(first, last).then(nextData => {
        if (currId !== updateId) return;
        setData(nextData, first);
      });
    }

    render() {
      const { data } = store.originalObject;

      console.log('Example render()', updateId);

      return (
        <VirtualizedList
          // <VirtualizedListScroll
          // scrollProps={{ y: true }}
          id={updateId}
          totalCount={totalCount}
          itemsCount={totalCount}
          overlapCount={10}
          itemHeight={40}
          renderItem={itemProps =>
            renderSimpleItems(itemProps, data[itemProps.key])
          }
          onScroll={state => this.onScroll(state)}
        />
      );
    }
  }
);
