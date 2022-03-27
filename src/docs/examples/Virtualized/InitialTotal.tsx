import { Component } from 'react';
import { VirtualizedListScroll, Spinner } from 'uilib';
import { createStore, withStore } from 'justorm/react';

const { renderSimpleItems } = helpers;

const PAGE_SIZE = 20;
const totalCount = 10;
const store = createStore('example', { data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });

export default withStore('example')(
  class Example extends Component {
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
          onScrollEnd={() => {}}
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
