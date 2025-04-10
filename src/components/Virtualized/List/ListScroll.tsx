import cn from 'classnames';

import { Scroll } from 'uilib/components/Scroll/Scroll';
import List from './List';

import type { Props as ScrollProps } from '../../Scroll/Scroll.types';
import type { Props as ListProps } from './List';

import S from './ListScroll.styl';

type Props = ListProps & {
  scrollProps: ScrollProps;
};

export default function ListScroll({ scrollProps, ...rest }: Props) {
  const innerClassName = cn(scrollProps.x && S.x, scrollProps.y && S.y);
  const props = {
    ...scrollProps,
    innerClassName,
  };

  return (
    <List
      {...rest}
      customWrapElem={{
        // @ts-ignore
        component: Scroll,
        props,
        // @ts-ignore
        getRef: ref => ref.innerElem,
      }}
    />
  );
}
