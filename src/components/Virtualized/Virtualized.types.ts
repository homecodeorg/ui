import { ReactElement, ReactNode } from 'react';
import { ComponentType } from 'uilib/types';

export type IndexesType = {
  first: number;
  last: number;
};

export type ItemProps = ComponentType & {
  // inline style to be applied to the item container.
  style?: any;
  key: number;
};

export type DefaultProps = {
  overlapCount: number;
};

export type State = IndexesType & {
  id: string;
  height: number;
  isFreezed: boolean;
};

type RenderProps = ComponentType & {
  state: IndexesType & { height: number };
  items: ReactNode[];
  onScroll: (e: MouseEvent) => void;
};

type GetItemPropsParams = {
  index: number;
  offsetBefore?: number;
  offsetAfter?: number;
};

type ScrollCallbackState = IndexesType & {
  scrollTop: number;
};

export type Props = Readonly<DefaultProps> &
  ComponentType & {
    // change to fire render
    id?: any;
    // DOM element that wraps the list of items.
    //
    // This is used to calculate the viewport dimensions and to handle scroll events.
    wrapElem: Element | null;
    // height of each item in the list.
    itemHeight: number;
    // Number of items to be rendered in the list.
    itemsCount: number;
    // total number of items in the list
    totalCount: number;
    // number of items to be rendered before and after the visible viewport.
    overlapCount?: number;
    // number of items to be rendered at a time.
    //
    // used to determine when the list has been scrolled to the end.
    pageSize?: number;
    // number of items to be rendered before the visible viewport.
    offsetBefore?: number;
    // number of items to be rendered after the visible viewport.
    offsetAfter?: number;
    // initial scroll position of the list.
    initialScrollTop?: number;
    // current scroll position of the list.
    scrollTop?: number;
    // called when the list is scrolled.
    onScroll?: (args: ScrollCallbackState) => void;
    // called when the list has been scrolled to the end.
    onScrollEnd?: () => void;
    // function that renders the list of items
    children: (props: RenderProps) => ReactNode;
    // function that renders an individual item in the list
    renderItem: (props: ItemProps) => ReactElement;
    // function that returns an object containing any additional props to be passed to each item in the list, based on the item index and any offsets.
    getItemProps: (params: GetItemPropsParams) => Record<string, any>;
  };

export type ViewProps = Omit<Props, 'children' | 'wrapElem' | 'getItemProps'>;
