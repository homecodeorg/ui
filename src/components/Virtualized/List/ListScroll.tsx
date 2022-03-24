import { forwardRef } from 'react';

import { Scroll } from 'uilib';
import List from './List';

import type { Props as ScrollProps } from 'uilib';
import type { Props as ListProps } from './List';

type Props = ListProps & {
  scrollProps: ScrollProps;
};

export default function ListScroll({ scrollProps, onScroll, ...rest }: Props) {
  return (
    <List
      {...rest}
      getRef={ref => ref?.innerElem.current}
      customWrapElem={forwardRef((props, ref) => (
        <Scroll
          {...scrollProps}
          {...props}
          onScroll={onScroll}
          ref={ref}
          // ref={ref => {
          //   rest.ref(ref?.innerElem.current);
          // }}
        />
      ))}
      // customWrapElem={{
      //   component: Scroll,
      //   props: scrollProps,
      //   getRef: ref => ref.innerElem.current,
      // }}
    />
  );
}
