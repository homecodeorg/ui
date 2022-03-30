import { Component, CSSProperties } from 'react';
import cn from 'classnames';

import { Button, Icon } from 'uilib';

import S from './Item.styl';

type Props = {
  className?: string;
  img?: string;
  onRemove?: () => void;
  loaded: number;
  total: number;
};

export default class Item extends Component<Props> {
  render() {
    const { className, img, loaded, total, onRemove, children } = this.props;
    const style = {} as CSSProperties;
    const isComplete = loaded === total;

    if (img) style.backgroundImage = `url(${img})`;

    return (
      <div className={cn(S.root, className)} style={style}>
        {children}

        <Button
          className={S.removeButton}
          size="s"
          variant="clear"
          isSquare
          onClick={onRemove}
        >
          <Icon type="delete" />
        </Button>

        <div
          className={cn(S.progress, isComplete && S.complete)}
          style={{ left: `${(loaded / total) * 100 - 100}%` }}
        />

        <div className={S.overlay} />
      </div>
    );
  }
}
