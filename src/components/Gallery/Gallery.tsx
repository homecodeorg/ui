import { Component } from 'react';
import { createStore } from 'justorm/react';
import Time from 'timen';
import compare from 'compareq';
import cn from 'classnames';

import { Button, Icon, throttle, array } from 'uilib';
import type { Size } from 'uilib/types';

import S from './Gallery.styl';

function getInitialState(items, startIndex) {
  const state = [...items.slice(startIndex, 3)];

  if (state.length === 2) state.push(items[0]);
  return state;
}

function Arr({ className, size, icon, ...rest }) {
  return (
    <Button
      className={cn(S.arr, className)}
      size={size}
      variant="clear"
      {...rest}
    >
      <Icon type={icon} size={size} />
    </Button>
  );
}

const DURATION = 200;
const DIR_NAME = {
  '1': 'left',
  '-1': 'right',
};

type Props = {
  items: string[];
  size?: Size;
  animation?: boolean;
  startIndex?: number;
  onChange?: (item: string) => void;
};

export class Gallery extends Component<Props> {
  store;
  timers = Time.create();

  static defaultProps = {
    size: 'm',
    animation: true,
    startIndex: 0,
  };

  constructor(props) {
    super(props);

    const { items, startIndex } = props;

    this.store = createStore(this, {
      items: getInitialState(items, startIndex),
      index: startIndex,
      movingDirection: 0,
    });
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.timers.clear();
  }

  componentDidUpdate(prevProps) {
    const { items, startIndex } = this.props;

    if (!compare(prevProps.items, items)) {
      this.store.items = getInitialState(items, startIndex);
    }
  }

  init() {
    const { items } = this.store;

    if (items.length > 1) this.subscribe();
  }

  subscribe() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  isSingle = () => this.store.items.length < 2;

  onKeyDown = e => {
    if (this.isSingle()) return;

    e.stopPropagation();

    if (e.key === 'ArrowRight') return this.move(-1);
    if (e.key === 'ArrowLeft') return this.move(1);
  };

  move = throttle(function (direction: -1 | 1) {
    this.store.movingDirection = direction;

    this.timers.after(DURATION, () => {
      this.store.index += direction * -1;
      this.store.items = array.circularSlice(
        this.props.items,
        this.store.index,
        3
      );
      this.store.movingDirection = 0;
    });
  }, DURATION);

  render() {
    const { size, items: _, animation, ...rest } = this.props;
    const { items, movingDirection } = this.store;
    const dirName = DIR_NAME[movingDirection];

    const classes = cn(S.root, this.isSingle() && S.single);
    const innerClasses = cn(S.inner, animation && S.animation, S[dirName]);

    return (
      <div className={classes} {...rest}>
        <div className={innerClasses}>
          {items.map(src => (
            <div
              className={S.item}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>

        <Arr
          className={S.left}
          size={size}
          icon="chevronLeft"
          onClick={() => this.move(1)}
        />
        <Arr
          className={S.right}
          size={size}
          icon="chevronRight"
          onClick={() => this.move(-1)}
        />
      </div>
    );
  }
}
