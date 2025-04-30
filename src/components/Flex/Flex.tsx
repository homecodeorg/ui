import { CSSProperties, HTMLAttributes } from 'react';

import S from './Flex.styl';

type FlexProps = HTMLAttributes<HTMLDivElement> &
  Pick<
    CSSProperties,
    | 'justifyContent'
    | 'alignItems'
    | 'flexDirection'
    | 'flexWrap'
    | 'flexGrow'
    | 'flexShrink'
    | 'flexBasis'
    | 'flex'
    | 'order'
    | 'alignSelf'
    | 'flexFlow'
  > & {
    children: React.ReactNode;
  };

export const Flex = ({
  children,
  justifyContent,
  alignItems,
  flexDirection,
  flexWrap,
  flexGrow,
  flexShrink,
  flexBasis,
  flex,
  order,
  alignSelf,
  flexFlow,
  ...props
}: FlexProps) => {
  return (
    <div
      className={S.root}
      // {...props}
      style={{
        justifyContent,
        alignItems,
        flexDirection,
        flexWrap,
        flexGrow,
        flexShrink,
        flexBasis,
        flex,
        order,
        alignSelf,
        flexFlow,
      }}
    >
      {children}
    </div>
  );
};
