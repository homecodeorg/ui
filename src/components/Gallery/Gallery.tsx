import {
  Component,
  createRef,
  CSSProperties,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createStore } from 'justorm/react';
import Time from 'timen';
import compare from 'compareq';
import cn from 'classnames';
import omit from 'lodash.omit';

import { Button } from 'uilib/components/Button/Button';
import { Icon } from 'uilib/components/Icon/Icon';
import { Spinner } from 'uilib/components/Spinner/Spinner';
import throttle from 'uilib/tools/throttle';
import { circularSlice } from 'uilib/tools/array';

import S from './Gallery.styl';
import * as T from './Gallery.types';
import { Lazy } from '../Lazy/Lazy';

const THRESHOLD = 50;
const DURATION = 200;
const DIR_NAME = {
  '1': 'left',
  '-1': 'right',
};

type Direction = -1 | 1;

type GalleryStoreTarget = {
  items: string[];
  movingDirection: number;
  isDragging: boolean;
};

function galleryStoreTarget(store: unknown): GalleryStoreTarget {
  const o = store as { originalObject?: GalleryStoreTarget };
  if (o.originalObject == null) {
    throw new Error('Gallery: justorm store missing originalObject');
  }
  return o.originalObject;
}

function getInitialState(items: T.Props['items'], startIndex) {
  return circularSlice(items, startIndex, 3);
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

function Item({ src, size }) {
  const [loaded, setLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const style = {} as CSSProperties;
  const imgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (!img || isError) return;

    let cancelled = false;
    const notify = () => {
      if (!cancelled) setLoaded(true);
    };

    // Cached images may never fire `load` after mount; `decode()` covers that path.
    if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      notify();
      return () => {
        cancelled = true;
      };
    }

    if (typeof img.decode === 'function') {
      img.decode().then(notify).catch(() => {});
      return () => {
        cancelled = true;
      };
    }

    requestAnimationFrame(() => {
      if (
        !cancelled &&
        img.complete &&
        (img.naturalWidth > 0 || img.naturalHeight > 0)
      )
        notify();
    });

    return () => {
      cancelled = true;
    };
  }, [src, isError]);

  if (loaded) style.backgroundImage = `url(${src})`;

  return (
    <div className={S.item} style={style}>
      {!loaded &&
        (isError ? (
          <Icon type="brokenImage" className={S.brokenImage} />
        ) : (
          <>
            <img
              ref={imgRef}
              src={src}
              onLoad={() => setLoaded(true)}
              onError={() => setIsError(true)}
            />
            <Spinner size={size} />
          </>
        ))}
    </div>
  );
}

export class Gallery extends Component<T.Props> {
  store;
  items;
  index = 0;
  timers = Time.create();
  startX = null;

  innerRef = createRef<HTMLDivElement>();

  static defaultProps = {
    size: 'm',
    animation: true,
    startIndex: 0,
  };

  constructor(props) {
    super(props);

    const { startIndex } = props;

    this.recenter();
    this.index = startIndex;
    this.store = createStore(this, {
      items: this.getStateItems(),
      movingDirection: 0,
      isDragging: false,
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

    if (
      prevProps.startIndex !== startIndex ||
      !compare(prevProps.items, items)
    ) {
      this.index = startIndex;
      this.recenter();
      const next = this.getStateItems();
      Object.assign(galleryStoreTarget(this.store), { items: next });
      this.setState({});
    }
  }

  getStateItems() {
    return this.isSingle()
      ? [this.props.items[0]]
      : getInitialState(this.items, this.index);
  }

  recenter() {
    const [...items] = this.props.items;
    this.items = [items.pop(), ...items];
  }

  init() {
    const { items } = this.store;

    if (items.length > 1) this.subscribe();
  }

  subscribe() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  isSingle = () => this.props.items.length < 2;

  onKeyDown = e => {
    if (this.isSingle()) return;

    if (e.key === 'ArrowRight') {
      e.stopPropagation();
      return this.move(-1);
    }

    if (e.key === 'ArrowLeft') {
      e.stopPropagation();
      return this.move(1);
    }
  };

  onPointerDown = e => {
    this.startX = e.pageX;
  };

  onPointerMove = e => {
    if (this.startX === null) return;

    const delta = this.getDelta(e);

    if (Math.abs(delta) < THRESHOLD) return;

    this.store.isDragging = true;
    this.setTransformDelta(delta);
  };

  onPointerUp = e => {
    if (!this.startX) return;

    const delta = this.getDelta(e);

    this.startX = null;

    if (!this.store.isDragging || !delta) return;

    this.store.isDragging = false;

    const dir = delta / Math.abs(delta);

    this.move(dir as Direction);
  };

  getDelta = e => e.pageX - this.startX;

  setTransformDelta = (delta: number) => {
    this.innerRef.current.style.transform = `translateX(calc(-100% / 3 + ${delta}px))`;
  };

  removeTransformDelta = () => {
    this.innerRef.current.style.transform = '';
  };

  move = throttle(function (direction: Direction) {
    const { animation } = this.props;

    this.store.isDragging = false;
    this.startX = null;

    if (!animation) return this.switch(direction);

    this.store.movingDirection = direction;
    this.timers.clear();
    this.timers.after(DURATION, () => this.switch(direction));
  }, DURATION) as (direction: Direction) => void;

  switch(direction: Direction) {
    this.index += direction * -1;
    const nextItems = circularSlice(this.items, this.index, 3);
    // justorm v3: proxy set skips when compareq sees no change; bypass via originalObject.
    Object.assign(galleryStoreTarget(this.store), {
      items: nextItems,
      movingDirection: 0,
    });
    this.removeTransformDelta();
    this.setState({});

    const { onChange } = this.props;

    onChange?.(this.index, this.items[this.index]);
  }

  render() {
    const {
      className,
      size,
      showArrows,
      showDots,
      initialBounce,
      cover,
      ...rest
    } = this.props;
    const { items, movingDirection, isDragging } = this.store;
    const dirName = DIR_NAME[movingDirection];
    const isSingle = this.isSingle();

    const props = omit(rest, ['items', 'onChange', 'animation', 'startIndex']);
    const classes = cn(
      S.root,
      isSingle && S.single,
      cover && S.cover,
      className
    );
    const innerClasses = cn(
      S.inner,
      initialBounce && S.initialBounce,
      S[dirName]
    );

    if (!isSingle) {
      props.onPointerDown = this.onPointerDown;
      props.onPointerMove = this.onPointerMove;

      if (isDragging) {
        props.onPointerUp = this.onPointerUp;
        props.onPointerLeave = this.onPointerUp;
      }
    }

    return (
      <div className={classes} {...props}>
        <div className={innerClasses} ref={this.innerRef}>
          {items.map((src, i) => (
            <Item key={`${i}_${src}`} src={src} size={size} />
          ))}
        </div>

        {!isSingle && showArrows && !isDragging && (
          <>
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
          </>
        )}

        {showDots && (
          <Lazy
            hideSpinner
            loader={() => import('./Dots/Dots')}
            // @ts-ignore
            index={this.index % items.length}
            count={items.length}
          />
        )}
      </div>
    );
  }
}
