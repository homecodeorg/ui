import { HTMLAttributes, ReactNode } from 'react';
import { Size } from 'uilib/types';

type ContentProps = HTMLAttributes<HTMLDivElement> & { className?: string };
export type Props = {
  className?: string;
  size?: Size;
  isOpen: boolean;
  header: ReactNode;
  headerClassName?: string;
  content: (props: ContentProps) => ReactNode | ReactNode;
  contentProps?: ContentProps;
  onChange?: (isOpen: boolean) => void;
};
