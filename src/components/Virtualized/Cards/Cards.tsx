import { Component, createRef, ReactNode } from 'react';
import cn from 'classnames';

import List from '../List/List';
import * as T from '../Virtualized.types';

import S from './Cards.styl';

type Props = T.Props & {
  itemMinWidth: number;
  itemMaxWidth: number;
  itemsMinMargin: number;
};

class ListCards extends Component<Props> {
  listElem = createRef<List>();

  state = {
    itemsInRow: 0,
    itemsCount: 0,
    totalCount: 0,
    overlapCount: 0,
  };

  static defaultProps = {
    itemsMinMargin: 16,
  };

  componentDidMount() {
    this.updateUnits();
    window.addEventListener('resize', this.updateUnits);
  }

  componentDidUpdate(prevProps) {
    const { itemsCount, totalCount } = this.props;

    if (
      itemsCount !== prevProps.itemsCount ||
      totalCount !== prevProps.totalCount
    ) {
      this.updateUnits();
    }
  }

  updateUnits = () => {
    // @ts-ignore
    const { offsetWidth } = this.listElem.current.wrapElem.current;
    const {
      itemsCount,
      totalCount,
      overlapCount,
      itemMinWidth,
      itemsMinMargin,
    } = this.props;

    const itemsInRow = Math.floor(
      offsetWidth / (itemMinWidth + itemsMinMargin)
    );
    const newState = {
      itemsInRow,
      itemsCount: Math.ceil(itemsCount / itemsInRow),
      totalCount: Math.ceil(totalCount / itemsInRow),
      overlapCount: Math.floor(overlapCount / itemsInRow),
    };

    this.setState(newState);
  };

  renderItem = ({ className, key, style }: T.ItemProps) => {
    const { itemsCount, renderItem } = this.props;
    const { itemsInRow } = this.state;

    const items = [] as ReactNode[];
    const itemsOffset = key * itemsInRow;

    for (let i = 0; i < itemsInRow && i + itemsOffset < itemsCount; i++) {
      const itemProps = {
        className: S.item,
        key: itemsOffset + i,
      } as T.ItemProps;

      items.push(renderItem(itemProps));
    }

    return (
      <div className={cn(className, S.row)} style={style}>
        {items}
      </div>
    );
  };

  render() {
    const { itemMinWidth, itemMaxWidth, itemsMinMargin } = this.props;
    const { itemsCount, totalCount, overlapCount } = this.state;

    console.log(itemsCount, totalCount);

    return [
      <List
        {...this.props}
        itemsCount={itemsCount}
        totalCount={totalCount}
        overlapCount={overlapCount}
        renderItem={this.renderItem}
        ref={this.listElem}
      />,
      <style>{`
        /* TODO: add uniq ID to selectors */
        .${S.item} {
          min-width: ${itemMinWidth}px;
          max-width: ${itemMaxWidth}px;
        }
        .${S.item} + .${S.item} {
          margin-left: ${itemsMinMargin}px;
        }
      `}</style>,
    ];
  }
}

export default ListCards;
