import { Component } from 'react';
import { createStore } from 'justorm/react';
import cn from 'classnames';
import Time from 'timen';

import { debounce } from 'uilib/tools';

import * as T from './Draggable.types';
import S from './Draggable.styl';

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

    this.store.draggingId = currentTarget.dataset.id;

    document.addEventListener('pointermove', this.onPointerMove, true);
    document.addEventListener('pointerup', this.onPointerUp, true);
  };

  onPointerMove = e => {
    if (!this.draggingElem) return;

    const { clientX: x, clientY: y } = e;

    e.stopPropagation();

    if (!this.dragStartFired) {
      this.dragStartFired = true;
      this.props.onDragStart?.(this.store.draggingId);
    }

    const dx = x - this.startPos.x;
    const dy = y - this.startPos.y;

    this.transformInner(this.draggingElem, `translate(${dx}px, ${dy}px)`);
  };

  onPointerOver = debounce(({ target }) => {
    const itemElem = target.closest(`.${S.item}`);
    const { id } = itemElem.dataset;
    const { underId } = this.store;

    if (!this.startPos || underId === id) return;

    const { x, y } = this.draggingElemBounds;
    const { x: x2, y: y2 } = this.selectInner(itemElem).getBoundingClientRect();
    const dx = x - x2;
    const dy = y - y2;

    this.store.underOffset = `translate(${dx}px, ${dy}px)`;
    this.store.underId = id;
  }, 100);

  onPointerOut = ({ target }) => {
    const { id } = target.dataset;

    if (!id || id === this.store.draggingId) return;

    this.transformInner(target, null);
    this.dropUnder();
  };

  onPointerUp = () => {
    const { underId, draggingId } = this.store;
    const { onChange, onDragEnd } = this.props;
    const { id } = this.draggingElem.dataset;

    document.removeEventListener('pointermove', this.onPointerMove, true);
    document.removeEventListener('pointerup', this.onPointerUp, true);

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
    const { items, className, itemClassName, renderItem } = this.props;
    const { draggingId, underId, underOffset } = this.store;

    return (
      <div className={cn(S.root, draggingId && S.dragging, className)}>
        {items.map(id => (
          <div
            key={id}
            className={cn(S.item, itemClassName, id === draggingId && S.active)}
            onPointerDown={this.onPointerDown}
            onPointerOver={this.onPointerOver}
            onPointerOut={this.onPointerOut}
            data-id={id}
          >
            <div
              className={S.inner}
              style={underId === id ? { transform: underOffset } : null}
            >
              {renderItem(id, id === draggingId)}
            </div>
          </div>
        ))}
      </div>
    );
  }
}