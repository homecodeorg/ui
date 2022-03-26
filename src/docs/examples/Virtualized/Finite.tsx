import { Component } from 'react';
import { VirtualizedListScroll, VirtualizedList, array, uid } from 'uilib';
import { createStore, withStore } from 'justorm/react';

const { getSimpleItemData, renderSimpleItems, loadData } = helpers;

const PAGE_SIZE = 20;
const totalCount = 100;
const loading = {}; // [id]: boolean
const store = createStore('example', { data: [] });
let updateId = uid.generateUID(); // update to fire render items, bcz itemsCount === totalCount

const loadNextData = (first, last) => loadData(first, last, getSimpleItemData);

function setData(nextData, startIndex = store.data.length) {
  store.data = array.insert(store.data, nextData, startIndex);
}

export default withStore('example')(
  class Example extends Component {
    componentDidMount() {
      updateId = uid.generateUID();
      loadNextData(0, PAGE_SIZE).zthen(setData);
    }

    loadNextData(first, last) {
      loadData(first, last, getSimpleItemData);
    }

    onScroll({ first, last }) {
      updateId = uid.generateUID();
      const currId = updateId;

      loadNextData(first, last).then(nextData => {
        if (currId !== updateId) return;
        setData(nextData, first);
      });
    }

    onScrollEnd() {
      const count = store.data.length;
      loadNextData(count, count + PAGE_SIZE).then(setData);
    }

    render() {
      const { data } = store.originalObject;
      const itemsCount = data.length;

      console.log('Example render()', itemsCount, updateId);

      return (
        // <VirtualizedList
        <VirtualizedListScroll
          id={updateId}
          scrollProps={{ y: true }}
          totalCount={totalCount}
          itemsCount={totalCount}
          overlapCount={10}
          itemHeight={40}
          renderItem={itemProps =>
            renderSimpleItems(itemProps, data[itemProps.key])
          }
          onScroll={state => this.onScroll(state)}
          // onScrollEnd={() => this.onScrollEnd()}
          pageSize={PAGE_SIZE}
        />
      );
    }
  }
);

// export default function Example() {
//   const [data, setData] = useState([]);
//   const itemsCount = data.length;

//   const loadNextData = useCallback(
//     (range = defaultRange) => {
//       loadData(range, getSimpleItemData, data).then(nextData => {
//         const newData = [...data];
//         newData.splice(range.first, nextData.length, ...nextData);
//         setData(newData);
//       });
//     },
//     [itemsCount, data]
//   );

//   useEffect(() => {
//     console.log('Example mounted');

//     loadNextData();
//   }, []);

//   return (
//     // <VirtualizedList
//     <VirtualizedListScroll
//       scrollProps={{ y: true }}
//       totalCount={totalCount}
//       itemsCount={itemsCount}
//       overlapCount={10}
//       itemHeight={40}
//       renderItem={itemProps => {
//         console.log('renderItem', itemProps.key, data[itemProps.key]);

//         return renderSimpleItems(itemProps, data[itemProps.key]);
//       }}
//       onScroll={loadNextData}
//     />
//   );
// }

// import { Component, Fragment } from 'react';
// import omit from 'lodash.omit';

// import State from 'docs/helpers/State';
// import Title from 'docs/helpers/Title';

// import { Form, SubmitButtons } from 'components/Form/Form';
// import { Container } from 'components/Container/Container';

// import { VirtualizedList, VirtualizedCards, VirtualizedTable } from '.';

// import S from './Virtualized.example.styl';
// import * as H from './Virtualized.example-helpers';

// class Example extends Component {
//   static defaultProps = {
//     Elem: VirtualizedList,
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       data: [],
//       totalCount: 500,
//       itemHeight: props.itemHeight || 40,
//       overlapCount: 10,
//       pageSize: PAGE_SIZE,
//     };
//   }

//   componentDidMount() {
//     this.loadData();
//   }

//   loadData = async () => {
//     const { getItemData, prefix } = this.props;
//     const { pageSize, totalCount } = this.state;
//     const data = [...this.state.data];
//     const itemsCount = data.length;
//     const indexTill = Math.min(totalCount, itemsCount + pageSize);

//     return new Promise(resolve => {
//       for (let i = itemsCount; i < indexTill; i++) {
//         data.push(getItemData(i));
//       }

//       this.setState({ data });
//       resolve();
//     });
//   };

//   render() {
//     const { Elem } = this.props;
//     const { data, itemHeight, totalCount } = this.state;
//     const itemsCount = data.length;

//     const renderItem = itemProps =>
//       this.props.renderItem(itemProps, data[itemProps.key]);

//     const formVals = omit(this.state, ['data']);
//     const infinityScrollProps = {
//       ...omit(formVals, ['pageSize']),
//       ...this.props,
//       itemsCount,
//       totalCount,
//       renderItem,
//     };

//     return (
//       <div className={S.root}>
//         <Container vertical className={S.form}>
//           <div className={S.count}>
//             {itemsCount} of {totalCount}
//           </div>
//           <SettingsForm
//             initialValues={formVals}
//             onSubmit={vals => this.setState(vals)}
//           />
//         </Container>
//         <div className={S.list}>
//           <Elem {...infinityScrollProps} onScrollEnd={this.loadData} />
//         </div>
//       </div>
//     );
//   }
// }

// export default () => (
//   <>
//     <Container vertical fullWidth>
//       <Title id="list-simple" text="List (simple)" />
//       <Example
//         getItemData={H.getSimpleItemData}
//         renderItem={H.renderSimpleItems}
//       />
//     </Container>

//     <Container vertical fullWidth>
//       <Title id="list-simple1" text="List (simple)1" />
//       <Example
//         getItemData={H.getSimpleItemData}
//         renderItem={H.renderSimpleItems}
//       />
//     </Container>

//     {/*
//     <Container vertical fullWidth>
//       <Title id="list-complex" text="List (complex)" />
//       <Example
//         getItemData={H.getSimpleItemData}
//         renderItem={H.renderComplexItem}
//       />
//     </Container>
//     <Container vertical>
//       <Title id="cards-simple" text="Cards (simple)" />
//       <Example
//         Elem={VirtualizedCards}
//         getItemData={H.getSimpleItemData}
//         renderItem={H.renderSimpleItems}
//         itemHeight={50}
//         itemMinWidth={190}
//         itemMaxWidth={230}
//       />
//     </Container>

//     <Container vertical>
//       <Title id="cards-complex" text="Cards (complex)" />
//       <Example
//         Elem={VirtualizedCards}
//         getItemData={H.getCardItemData}
//         renderItem={H.renderCardItem}
//         itemHeight={270}
//         itemMinWidth={190}
//         itemMaxWidth={230}
//       />
//     </Container>

//     <Container vertical>
//       <Title id="table" text="Table" />
//       <Example
//         Elem={VirtualizedTable}
//         getItemData={H.getTableItemData}
//         renderItem={H.renderTableRow}
//         thead={H.renderTableHeader()}
//       />
//     </Container>
//     */}
//   </>
// );
