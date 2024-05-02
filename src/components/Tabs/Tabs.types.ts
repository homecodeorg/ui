import { Size } from 'uilib/types';
import { ButtonProps } from '../Button/Button';

type ID = string | number;

export type Item = ButtonProps & {
  id: ID;
  label: string;
  content: React.ReactNode | (() => React.ReactNode);
  contentClassName?: string;
  forceRender?: boolean;
  onClick?: (e: MouseEvent) => boolean | void;
};

export type RenderProps = {
  tabs: React.ReactNode;
  content: React.ReactNode;
};

export type Props = {
  size?: Size;
  className?: string;
  contentClassName?: string;
  items: Item[];
  hideTabsIfSingle?: boolean;
  activeId?: ID;
  onChange: (id: ID) => void;
  renderAll?: boolean;
  children?: (props: RenderProps) => React.ReactNode;
};
