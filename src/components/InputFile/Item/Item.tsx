import { Component, CSSProperties, HTMLProps } from 'react';
import cn from 'classnames';

import { Button, Icon } from 'uilib';

import S from './Item.styl';

type Props = {
  className?: string;
  img?: string;
  onRemove?: HTMLProps<HTMLButtonElement>['onClick'];
  onClick?: () => void;
  total: number;
  loaded: number;
  waitingForUpload?: boolean;
};

export default class Item extends Component<Props> {
  render() {
    const {
      className,
      img,
      total,
      loaded,
      waitingForUpload,
      children,
      onRemove,
      ...rest
    } = this.props;
    const style = {} as CSSProperties;
    const isComplete = loaded === total;
    const isLoading = !isComplete && loaded > 0;
    const classes = cn(
      S.root,
      waitingForUpload && S.waitingForUpload,
      isLoading && S.loading,
      className
    );

    if (img) style.backgroundImage = `url(${img})`;

    return (
      <div {...rest} className={classes} style={style}>
        {children}

        <Button
          className={S.removeButton}
          size="s"
          variant="clear"
          square
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
