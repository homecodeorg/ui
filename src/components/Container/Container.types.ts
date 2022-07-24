export type Props = {
  className?: string;
  size?: 's' | 'm' | 'l' | 'xl';
  children: any;
  alignItemsCenter?: boolean;
  justifyContentCenter?: boolean;
  vertical?: boolean;
  fullHeight?: boolean | string;
  fullWidth?: boolean | string;
  scrolledX?: boolean;
  scrolledY?: boolean;
  style?: Partial<CSSStyleDeclaration>;
};
