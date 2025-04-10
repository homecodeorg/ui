import { HTMLAttributes } from 'react';

import S from './Flex.styl';

type FlexProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const Flex = ({ children, ...props }: FlexProps) => {
  return (
    <div className={S.root} {...props}>
      {children}
    </div>
  );
};
