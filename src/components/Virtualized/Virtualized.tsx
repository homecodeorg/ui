import { Component, ReactNode } from 'react';
import cn from 'classnames';
import pick from 'lodash.pick';
import compare from 'compareq';

import { debounce } from 'uilib';
import Time from 'timen';

import * as T from './Virtualized.types';
import * as H from './Virtualized.helpers';
import S from './Virtualized.styl';

class Virtualized extends Component<T.Props, T.State> {
  clearUnfreezeTimer;
  scrollTopInited = false;
  scrollElem: Element;
  lastScrollEndIndex = 0;

  static defaultProps = {
    overlapCount: 10,
    pageSize: 20,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      height: H.getHeight(props),
      first: 0,
      last: 0,
      isFreezed: false,
    };

    this.onScroll = debounce(this.onScroll, 150);
    this.checkIfEnd = debounce(this.checkIfEnd, 200);
  }

  static getDerivedStateFromProps(props, { height }) {
    const newHeight = H.getHeight(props);

    if (newHeight !== height) return { height: newHeight };
    return null;
  }

  componentDidMount() {
    // Time.after(100, () => {
    const indexes = this.getIndexes();
    this.setState(indexes); // eslint-disable-line
    // });
    // document.addEventListener('scroll', this.onScroll, true);
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { itemHeight, itemsCount } = this.props;

    if (itemsCount === 0 && itemsCount !== prevProps.itemsCount) return 0;
    if (this.scrollElem) {
      if (itemHeight !== prevProps.itemHeight)
        return (itemHeight / prevProps.itemHeight) * this.scrollElem.scrollTop;
    }

    return null;
  }

  shouldComponentUpdate(
    nextProps: Readonly<T.Props>,
    nextState: Readonly<T.State>
  ): boolean {
    if (nextProps.id !== this.props.id) return true;
    if (nextProps.itemsCount !== this.props.itemsCount) return true;
    if (nextProps.wrapElem !== this.props.wrapElem) return true;
    if (!compare(nextState, this.state)) return true;

    return false;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const state = {} as T.State;
    const scrollElemUpdated = this.scrollElem !== this.props.wrapElem;

    if (scrollElemUpdated) this.scrollElem = this.props.wrapElem;

    if (this.scrollElem) {
      const newScrollTop = this.getNewScrollTop(prevProps, snapshot);
      if (typeof newScrollTop === 'number')
        this.scrollElem.scrollTop = newScrollTop;
    }

    if (prevProps.id !== this.props.id) state.id = this.props.id;

    if (scrollElemUpdated || this.needUpdateIndexes(prevProps))
      Object.assign(state, this.getIndexes());

    if (this.needUpdateHeight(prevProps))
      state.height = H.getHeight(this.props);

    if (Object.keys(state).length) this.setState(state);
  }

  componentWillUnmount() {
    this.clearUnfreezeTimer?.();
  }

  needUpdateIndexes(prevProps) {
    // const { wrapElem } = this.props;

    // if (!prevProps.wrapElem && wrapElem) return true;

    return ['id', 'itemsCount', 'totalCount', 'overlapCount'].some(
      key => prevProps[key] !== this.props[key]
    );
  }

  needUpdateHeight(prevProps) {
    return ['totalCount', 'offsetAfter'].some(
      key => prevProps[key] !== this.props[key]
    );
  }

  getNewScrollTop(prevProps, snapshot) {
    const { initialScrollTop, scrollTop, itemsCount } = this.props;

    if (!this.scrollTopInited) {
      const scrollValue = initialScrollTop ?? scrollTop;

      if (scrollValue && prevProps.itemsCount && itemsCount) {
        this.scrollTopInited = true;
        return scrollValue;
      }
    }

    if (prevProps.initialScrollTop > 0 && initialScrollTop === 0) return 0;

    if (typeof scrollTop === 'number' && scrollTop !== prevProps.scrollTop)
      return scrollTop;

    if (typeof snapshot === 'number') return snapshot;

    return null;
  }

  getIndexes(): T.IndexesType | null {
    // const { wrapElem } = this.props;

    if (!this.scrollElem) return null;

    const { scrollTop, clientHeight } = this.scrollElem;

    return H.getIndexes({
      scrollTop,
      clientHeight,
      ...pick(this.props, [
        'itemsCount',
        'totalCount',
        'itemHeight',
        'overlapCount',
      ]),
    });
  }

  onScroll = e => {
    this.scrollElem = e.target;

    const { onScroll } = this.props;
    const indexes = this.getIndexes() as T.State;
    const { scrollTop } = this.scrollElem;

    if (onScroll) onScroll({ scrollTop, ...indexes });

    this.checkIfEnd();

    if (!compare(indexes, pick(this.state, ['first', 'last'])))
      this.setState({ ...indexes });

    this.unfreeze();
  };

  checkIfEnd = () => {
    const { itemsCount, totalCount, pageSize, onScrollEnd } = this.props;

    if (itemsCount === totalCount) return;
    if (itemsCount < this.lastScrollEndIndex) return;

    this.lastScrollEndIndex = itemsCount + pageSize;
    onScrollEnd?.();
  };

  unfreeze = () => {
    this.clearUnfreezeTimer?.();
    this.clearUnfreezeTimer = Time.after(200, () => {
      this.setState({ isFreezed: false });
    });
  };

  getItemProps = (index: number) => {
    const { getItemProps, offsetBefore, offsetAfter } = this.props;
    const props = {
      className: S.item,
      key: index,
    } as T.ItemProps;

    if (getItemProps) {
      const { className, ...rest } = getItemProps({
        index,
        offsetBefore,
        offsetAfter,
      });

      props.className = cn(props.className, className);
      Object.assign(props, rest);
    }

    return props;
  };

  renderItems() {
    const { itemsCount, renderItem } = this.props;
    const { first, last } = this.state;
    const items = [] as ReactNode[];

    if (itemsCount > 0) {
      for (let i = first; i <= last; i++) {
        items.push(renderItem(this.getItemProps(i)));
      }
    }

    return items;
  }

  render() {
    const { children, className, pageSize, ...rest } = this.props;
    const { isFreezed } = this.state;
    const state = {
      ...pick(this.state, ['first', 'last', 'height']),
      ...pick(this.props, ['offsetBefore', 'offsetAfter']),
    };

    return children({
      ...rest,
      state,
      className: cn(S.root, isFreezed && S.freezeClicks, className),
      onScroll: this.onScroll,
      items: this.renderItems(),
    });
  }
}

export default Virtualized;
