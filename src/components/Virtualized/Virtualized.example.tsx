import { Component, Fragment } from 'react';
import omit from 'lodash.omit';

import State from 'helpers/State';
import Title from 'helpers/Title';

import { Form, SubmitButtons } from 'components/Form/Form';
import { Container } from 'components/Container/Container';

import { VirtualizedList, VirtualizedCards, VirtualizedTable } from '.';

import S from './Virtualized.example.styl';
import * as H from './Virtualized.example-helpers';

const PAGE_SIZE = 20;

function SettingsForm(props) {
  const { initialValues } = props;

  return (
    <Form {...props}>
      {({ Field, isDirty, reset }) => (
        <Fragment>
          {Object.keys(initialValues).map(name => (
            <span key={name}>
              {name}:
              <Field name={name} id={name} type="number" />
            </span>
          ))}
          <SubmitButtons
            buttons={[
              {
                key: 'reset',
                children: 'Reset',
                disabled: !isDirty,
                onClick: reset,
              },
              {
                key: 'apply',
                children: 'Apply',
                disabled: !isDirty,
                variant: 'primary',
                type: 'submit',
              },
            ]}
          />
        </Fragment>
      )}
    </Form>
  );
}

class Example extends Component {
  static defaultProps = {
    Elem: VirtualizedList,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      totalCount: 500,
      itemHeight: props.itemHeight || 40,
      overlapCount: 10,
      pageSize: PAGE_SIZE,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { getItemData, prefix } = this.props;
    const { pageSize, totalCount } = this.state;
    const data = [...this.state.data];
    const itemsCount = data.length;
    const indexTill = Math.min(totalCount, itemsCount + pageSize);

    return new Promise(resolve => {
      for (let i = itemsCount; i < indexTill; i++) {
        data.push(getItemData(i));
      }

      this.setState({ data });
      resolve();
    });
  };

  render() {
    const { Elem } = this.props;
    const { data, itemHeight, totalCount } = this.state;
    const itemsCount = data.length;

    const renderItem = itemProps =>
      this.props.renderItem(itemProps, data[itemProps.key]);

    const formVals = omit(this.state, ['data']);
    const infinityScrollProps = {
      ...omit(formVals, ['pageSize']),
      ...this.props,
      itemsCount,
      totalCount,
      renderItem,
    };

    return (
      <div className={S.root}>
        <Container vertical className={S.form}>
          <div className={S.count}>
            {itemsCount} of {totalCount}
          </div>
          <SettingsForm
            initialValues={formVals}
            onSubmit={vals => this.setState(vals)}
          />
        </Container>
        <div className={S.list}>
          <Elem {...infinityScrollProps} onScrollEnd={this.loadData} />
        </div>
      </div>
    );
  }
}

export default () => (
  <>
    <Container vertical fullWidth>
      <Title id="list-simple" text="List (simple)" />
      <Example
        getItemData={H.getSimpleItemData}
        renderItem={H.renderSimpleItems}
      />
    </Container>

    <Container vertical fullWidth>
      <Title id="list-simple1" text="List (simple)1" />
      <Example
        getItemData={H.getSimpleItemData}
        renderItem={H.renderSimpleItems}
      />
    </Container>

    {/*
    <Container vertical fullWidth>
      <Title id="list-complex" text="List (complex)" />
      <Example
        getItemData={H.getSimpleItemData}
        renderItem={H.renderComplexItem}
      />
    </Container>
    <Container vertical>
      <Title id="cards-simple" text="Cards (simple)" />
      <Example
        Elem={VirtualizedCards}
        getItemData={H.getSimpleItemData}
        renderItem={H.renderSimpleItems}
        itemHeight={50}
        itemMinWidth={190}
        itemMaxWidth={230}
      />
    </Container>

    <Container vertical>
      <Title id="cards-complex" text="Cards (complex)" />
      <Example
        Elem={VirtualizedCards}
        getItemData={H.getCardItemData}
        renderItem={H.renderCardItem}
        itemHeight={270}
        itemMinWidth={190}
        itemMaxWidth={230}
      />
    </Container>

    <Container vertical>
      <Title id="table" text="Table" />
      <Example
        Elem={VirtualizedTable}
        getItemData={H.getTableItemData}
        renderItem={H.renderTableRow}
        thead={H.renderTableHeader()}
      />
    </Container>
    */}
  </>
);
