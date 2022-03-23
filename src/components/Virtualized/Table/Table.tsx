import { Component, createRef, ReactNode } from 'react';
import { bind } from 'decko';
import cn from 'classnames';

import Virtualized from '../Virtualized';
import { ViewProps } from '../Virtualized.types';
import S from './Table.styl';

type Props = ViewProps & {
  thead?: ReactNode;
  tfoot?: ReactNode;
  maxHeight?: string | number;
};

class Table extends Component<Props> {
  wrapElem = createRef<HTMLDivElement>();
  gapBeforeElem = createRef<HTMLTableRowElement>();
  gapAfterElem = createRef<HTMLTableRowElement>();

  state = {
    colsWidth: [],
  };
  statesLog = [];

  componentDidUpdate(prevProps) {
    const { itemsCount } = this.props;
    const firstItemsRendered = prevProps.itemsCount === 0 && itemsCount > 0;

    if (firstItemsRendered) this.fixColWidth();
  }

  fixColWidth() {
    const elem = this.wrapElem.current;
    if (!elem) return;

    const { offsetWidth } = elem;
    const cols = elem.querySelectorAll('th');
    const colsWidth = [].slice
      .call(cols)
      // @ts-ignore
      .map(th => (th.offsetWidth / offsetWidth) * 100);

    this.setState({ colsWidth });
  }

  @bind
  renderLayout({ state, items, onScroll, ...props }) {
    const {
      className,
      thead,
      tfoot,
      maxHeight,
      totalCount,
      itemHeight,
    } = this.props;
    const { colsWidth } = this.state;
    const { first, last } = state;
    const beforeHeight = first * itemHeight;
    const afterHeight = Math.max(0, totalCount - 1 - last) * itemHeight;

    return (
      <div className={S.root} style={{ maxHeight }}>
        <div {...props} onScroll={onScroll} ref={this.wrapElem}>
          <table className={className}>
            {thead && <thead>{thead}</thead>}
            <tbody>
              <tr ref={this.gapBeforeElem} style={{ height: beforeHeight }} />
              {items}
              <tr ref={this.gapAfterElem} style={{ height: afterHeight }} />
            </tbody>
            {tfoot && <tfoot>{tfoot}</tfoot>}
          </table>
          <style>{`
            .${S.item} { height: ${itemHeight}px; }
            ${colsWidth
              .map(
                (w, i) =>
                  `.${S.table} th:nth-child(${i + 1}) { width: ${
                    colsWidth[i]
                  }%; }\n`
              )
              .join('')}
          `}</style>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Virtualized
        {...this.props}
        wrapElem={this.wrapElem?.current}
        getItemProps={() => ({ className: S.item })}
      >
        {this.renderLayout}
      </Virtualized>
    );
  }
}

export default Table;
