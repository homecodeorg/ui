import { VirtualizedListScroll, Spinner } from 'uilib';
import { createStore, useStore } from 'justorm';

const { renderSimpleItems } = helpers;

const PAGE_SIZE = 20;
const totalCount = 10;

createStore('example', {
  data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
});

export default function ContentBefore() {
  const { example } = useStore({ example: ['data'] });
  const itemsCount = example.data.length;

  return (
    <VirtualizedListScroll
      className={S.root}
      scrollProps={{ y: true }}
      totalCount={totalCount}
      itemsCount={itemsCount}
      overlapCount={10}
      itemHeight={40}
      renderItem={itemProps =>
        renderSimpleItems(itemProps, data[itemProps.key])
      }
      onScrollEnd={() => {}}
      contentBefore={<div className={S.contentGap}>content before</div>}
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
