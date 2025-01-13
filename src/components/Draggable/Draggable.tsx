import * as T from './Draggable.types';

import { Component } from 'react';
import S from './Draggable.styl';
import Time from 'timen';
import cn from 'classnames';
import { createStore } from 'justorm/react';
import { debounce } from 'uilib/tools';

export class Draggable extends Component<T.Props> {
  store;

  startPos = null;

  draggingElem = null;
  draggingElemBounds = null;

  dragStartFired = false;

  timers = Time.create();

  constructor(props) {
    super(props);

    this.store = createStore(this, {
      draggingId: null,
      underId: null,
      underOffset: '',
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items.join(',') !== this.props.items.join(',')) {
      this.dropUnder();
    }
  }

  componentWillUnmount() {
    this.timers.clear();
  }

  onPointerDown = e => {
    const { clientX: x, clientY: y, currentTarget } = e;

    e.stopPropagation();
    this.timers.clear();

    this.startPos = { x, y };

    this.draggingElem = currentTarget;
    this.draggingElemBounds = currentTarget.getBoundingClientRect();

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  };

  onPointerMove = e => {
    if (!this.draggingElem) return;

    const { clientX: x, clientY: y } = e;

    if (!this.store.draggingId) {
      this.store.draggingId = this.draggingElem.dataset.id;
    }

    if (!this.dragStartFired) {
      this.dragStartFired = true;
      this.props.onDragStart?.(this.store.draggingId);
    }

    const dx = x - this.startPos.x;
    const dy = y - this.startPos.y;

    this.transformInner(this.draggingElem, `translate(${dx}px, ${dy}px)`);

    this.checkUnderElem(x, y);
  };

  checkUnderElem = debounce((x: number, y: number) => {
    const underItem = document.elementFromPoint(x, y)?.closest(`.${S.item}`);

    if (!underItem) {
      this.store.underOffset = '';
      this.store.underId = null;
      return;
    }

    // @ts-ignore
    const { id } = underItem.dataset;
    const { draggingId, underId } = this.store;

    if (!this.startPos || id === draggingId || id === underId) return;

    const { x: x1, y: y1 } = this.draggingElemBounds;
    const { x: x2, y: y2 } =
      this.selectInner(underItem).getBoundingClientRect();
    const dx = x1 - x2;
    const dy = y1 - y2;

    this.store.underOffset = `translate(${dx}px, ${dy}px)`;
    this.store.underId = id;
  }, 100);

  onPointerOut = ({ target }) => {
    const { id } = target.dataset;

    if (!id || id === this.store.draggingId) return;

    this.transformInner(target, null);
    this.dropUnder();
  };

  onPointerUp = e => {
    const { underId, draggingId } = this.store;
    const { onChange, onDragEnd } = this.props;
    const { id } = this.draggingElem.dataset;

    if (draggingId) {
      e.stopPropagation();
      e.preventDefault();
    }

    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);

    this.dragStartFired = false;
    this.startPos = null;
    this.store.draggingId = null;

    if (underId && onChange) {
      const newItems = [...this.props.items];
      const draggingIndex = newItems.indexOf(id);
      const underIndex = newItems.indexOf(underId);

      newItems[underIndex] = id;
      newItems[draggingIndex] = underId;

      onChange(newItems);
    }

    this.dropUnder();

    this.timers.after(100, () => {
      if (this.draggingElem) {
        this.selectInner(this.draggingElem).style.transform = null;
        this.draggingElem = null;
      }

      onDragEnd?.(draggingId);
    });
  };

  selectInner = elem => elem.querySelector('& > div');

  transformInner(elem, str?) {
    if (!elem) return;
    this.selectInner(elem).style.transform = str;
  }

  dropUnder() {
    this.store.underId = null;
    this.store.underOffset = null;
  }

  render() {
    const { items, className, itemClassName, renderItem, children } =
      this.props;
    const { draggingId, underId, underOffset } = this.store;

    return (
      <div className={cn(S.root, draggingId && S.dragging, className)}>
        {items.map((id, index) => (
          <div
            key={id}
            className={cn(S.item, itemClassName, id === draggingId && S.active)}
            onPointerDown={this.onPointerDown}
            data-id={id}
          >
            <div
              className={S.inner}
              style={underId === id ? { transform: underOffset } : null}
            >
              {renderItem(id, index, id === draggingId)}
            </div>
          </div>
        ))}
        {children}
      </div>
    );
  }
}
