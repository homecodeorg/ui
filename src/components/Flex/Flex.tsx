import { CSSProperties, HTMLAttributes } from 'react';

import S from './Flex.styl';

type FlexProps = HTMLAttributes<HTMLDivElement> &
  CSSProperties & {
    children: React.ReactNode;
  };

export const Flex = ({ children, ...props }: FlexProps) => {
  return (
    <div
      className={S.root}
      {...props}
      style={{
        justifyContent: props.justifyContent,
        alignItems: props.alignItems,
        flexDirection: props.flexDirection,
        flexWrap: props.flexWrap,
        flexGrow: props.flexGrow,
        flexShrink: props.flexShrink,
        flexBasis: props.flexBasis,
        flex: props.flex,
        order: props.order,
        alignSelf: props.alignSelf,
        flexFlow: props.flexFlow,
      }}
    >
      {children}
    </div>
  );
};
