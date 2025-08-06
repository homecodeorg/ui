import { Component } from 'react';
import cn from 'classnames';

import { Paranja } from 'uilib/components/Paranja/Paranja';
import { Scroll } from 'uilib/components/Scroll/Scroll';
import { Spinner } from 'uilib/components/Spinner/Spinner';

import S from './Table.styl';
import * as T from './Table.types';

export class Table extends Component<T.Props> {
  renderHeaderColumn = ({ id, label, sticky }: T.Column) => (
    <th key={id} className={cn(sticky && S.sticky)}>
      {label}
    </th>
  );

  renderRow = (data: T.Data) => {
    const { columns } = this.props;

    return (
      <tr key={data.id} className={data.className}>
        {columns.map(param => this.renderDataCol(param, data))}
      </tr>
    );
  };

  renderDataCol({ id, dataField, render, sticky }: T.Column, data: T.Data) {
    return (
      <td key={id} className={cn(sticky && S.sticky)}>
        {render ? render(data) : data[dataField || id]}
      </td>
    );
  }

  render() {
    const {
      className,
      columns,
      isLoading = false,
      loadingText,
      blur,
      data,
    } = this.props;

    return (
      <div className={cn(S.root, blur && S.blur, className)}>
        <Scroll
          x
          y
          offset={{ x: { before: 10, after: 10 } }}
          className={S.scroll}
          xScrollbarClassName={S.xScrollbar}
          yScrollbarClassName={S.yScrollbar}
        >
          <table>
            <thead>
              <tr>{columns.map(this.renderHeaderColumn)}</tr>
            </thead>
            <tbody>{data.map(this.renderRow)}</tbody>
          </table>
        </Scroll>

        <Paranja inline visible={isLoading} blur={blur}>
          {isLoading && (loadingText ?? <Spinner />)}
        </Paranja>
      </div>
    );
  }
}
