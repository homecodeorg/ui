import { Component, createRef, ReactNode } from 'react';
import omit from 'lodash.omit';
import { createStore } from 'justorm/react';
import Time from 'timen';

import { zero } from 'uilib/tools/number';

import Virtualized from '../Virtualized';
import * as T from '../Virtualized.types';
import S from './List.styl';

const CONTENT_BEFORE_SIZE_CHECK_TIMEOUT = 300;

type Props = T.Props & {
  contentBefore?: ReactNode;
  contentAfter?: ReactNode;
};

class List extends Component<Props> {
  store;
  wrapElem;
  contentBeforeElem;
  contentAfterElem;
  timers = Time.create();
  unsubscribeContentBeforeResize;

  constructor(props) {
    super(props);

    this.store = createStore(this, {
      mouned: false,
      contentBeforeHeight: 0,
      hasWrap: false,
    });

    this.wrapElem = createRef<HTMLDivElement>();
    this.contentBeforeElem = createRef<HTMLDivElement>();
    this.contentAfterElem = createRef<HTMLDivElement>();
  }

  componentDidMount() {
    // update, to pass actual wrapElem to Virtualized props
    this.store.mounted = true;

    if (this.props.contentBefore) this.subscribeContentBeforeResize();
  }

  componentDidUpdate(prevProps) {
    const { contentBefore } = this.props;

    if (!prevProps.contentBefore && contentBefore)
      this.subscribeContentBeforeResize();

    if (prevProps.contentBefore && !contentBefore)
      this.unsubscribeContentBeforeResize?.();
  }

  subscribeContentBeforeResize() {
    this.unsubscribeContentBeforeResize = Time.every(
      CONTENT_BEFORE_SIZE_CHECK_TIMEOUT,
      this.checkContentBeforeHeight
    );
  }

  checkContentBeforeHeight = () => {
    const elem = this.contentBeforeElem.current;

    if (!elem) return;

    const { offsetHeight } = elem;

    if (offsetHeight !== this.store.contentBeforeHeight)
      this.store.contentBeforeHeight = offsetHeight;
  };

  getProps() {
    const props = omit(this.props, ['contentBefore', 'contentAfter']);
    const { contentBeforeHeight } = this.store;

    const offsetBefore =
      zero(contentBeforeHeight) + zero(this.props.offsetBefore);
    const offsetAfter =
      zero(this.contentAfterElem.current?.offsetHeight) +
      zero(this.props.offsetAfter);

    if (offsetBefore) props.offsetBefore = offsetBefore;
    if (offsetAfter) props.offsetAfter = offsetAfter;

    return props;
  }

  getItemProps = ({ index, offsetBefore, offsetAfter }) => {
    const { itemHeight } = this.props;

    return {
      className: S.item,
      style: { top: zero(offsetBefore) + index * itemHeight },
    };
  };

  onWrapRef = ref => {
    this.wrapElem = ref;
    this.store.hasWrap = true;
  };

  renderLayout = ({ state, items, ...rest }) => {
    const { contentBefore, contentAfter } = this.props;
    const { height, offsetBefore, offsetAfter } = state;
    const props = omit(rest, [
      'contentBefore',
      'contentAfter',
      'scrollTop',
      'itemHeight',
      'itemsCount',
      'totalCount',
      'overlapCount',
      'onScrollEnd',
      'renderItem',
      'wrapElem',
      'getItemProps',
      'offsetAfter',
      'offsetBefore',
    ]);

    return (
      <div {...props} ref={this.onWrapRef}>
        {contentBefore && (
          <div ref={this.contentBeforeElem} key="contentBefore">
            {contentBefore}
          </div>
        )}
        <div className={S.gap} style={{ height }} key="gap" />
        {items}
        {contentAfter && (
          <div
            className={S.contentAfter}
            ref={this.contentAfterElem}
            style={{ top: height - zero(offsetAfter) }}
            key="contentAfter"
          >
            {contentAfter}
          </div>
        )}
      </div>
    );
  };

  render() {
    return (
      <Virtualized
        {...this.getProps()}
        wrapElem={this.wrapElem}
        getItemProps={this.getItemProps}
      >
        {this.renderLayout}
      </Virtualized>
    );
  }
}

export default List;
