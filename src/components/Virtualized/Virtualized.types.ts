import { ReactElement, ReactNode } from 'react';

export type IndexesType = {
  first: number;
  last: number;
};

export type ItemProps = {
  className: string;
  style: any;
  key: number;
};

export type DefaultProps = {
  overlapCount: number;
};

export type State = IndexesType & {
  height: number;
  isFreezed: boolean;
};

type RenderProps = {
  className?: string;
  state: IndexesType & Pick<State, 'height'>;
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

export type Props = {
  id?: any; // change to fire render
  className?: string;
  wrapElem: Element | null;
  itemHeight: number;
  itemsCount: number;
  totalCount: number;
  overlapCount?: number;
  pageSize?: number; // every `pageSize` will be called `onScrollEnd`
  offsetBefore?: number;
  offsetAfter?: number;
  initialScrollTop?: number;
  scrollTop?: number; // change to update list scrollTop
  onScroll?: (args: ScrollCallbackState) => void;
  onScrollEnd?: () => void;
  children: (props: RenderProps) => ReactNode;
  renderItem: (props: ItemProps) => ReactElement;
  getItemProps: (params: GetItemPropsParams) => { [key: string]: any };
  style?: any;
} & Readonly<DefaultProps>;

export type ViewProps = Omit<Props, 'children' | 'wrapElem' | 'getItemProps'>;
