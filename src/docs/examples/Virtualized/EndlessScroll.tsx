import { Component } from 'react';
import { VirtualizedListScroll, array, Spinner } from 'uilib';
import { createStore, withStore } from 'justorm/react';

const { getSimpleItemData, renderSimpleItems, loadData } = helpers;

const PAGE_SIZE = 20;
const totalCount = 100;
const store = createStore('example', { data: [] });

const loadNextData = (first, last) =>
  loadData(first, last, getSimpleItemData, 1000);

function setData(nextData, startIndex = store.data.length) {
  store.data = array.insert(store.data, nextData, startIndex);
}

export default withStore('example')(
  class Example extends Component {
    componentDidMount() {
      loadNextData(0, PAGE_SIZE).then(setData);
    }

    onScrollEnd() {
      const count = store.data.length;
      loadNextData(count, count + PAGE_SIZE).then(setData);
    }

    render() {
      const { data } = store.originalObject;
      const itemsCount = data.length;

      return (
        <VirtualizedListScroll
          scrollProps={{ y: true }}
          totalCount={totalCount}
          itemsCount={itemsCount}
          overlapCount={10}
          itemHeight={40}
          renderItem={itemProps =>
            renderSimpleItems(itemProps, data[itemProps.key])
          }
          onScrollEnd={() => this.onScrollEnd()}
          contentAfter={
            itemsCount !== totalCount && (
              <>
                <Spinner size="s" style={{ marginRight: 10 }} />
                loading items...
              </>
            )
          }
          pageSize={PAGE_SIZE}
        />
      );
    }
  }
);
