import { Scroll } from 'uilib';
import List from './List';

import type { Props as ScrollProps } from 'uilib';
import type { Props as ListProps } from './List';

type Props = ListProps & {
  scrollProps: ScrollProps;
};

export default function ListScroll({ scrollProps, ...rest }: Props) {
  return (
    <List
      {...rest}
      // customWrapElem={props => (
      //   <Scroll
      //     {...scrollProps}
      //     {...props}
      //     ref={ref => {
      //       console.log('ref', ref);

      //       // debugger;
      //       return ref?.innerElem.current;
      //     }}
      //   />
      // )}
      customWrapElem={{
        component: Scroll,
        props: scrollProps,
        getRef: ref => ref.innerElem.current,
      }}
    />
  );
}
