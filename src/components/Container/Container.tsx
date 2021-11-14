import cn from 'classnames';

import S from './Container.styl';

type Props = {
  className?: string;
  size?: 's' | 'm' | 'l';
  children: any;
  centered?: boolean;
  vertical?: boolean;
  fullHeight?: boolean | string;
  fullWidth?: boolean | string;
  scrolledX?: boolean;
  scrolledY?: boolean;
  style?: Partial<CSSStyleDeclaration>;
};

export function Container(props: Props) {
  const {
    className,
    children,
    size,
    centered,
    vertical,
    fullHeight,
    fullWidth,
    scrolledX,
    scrolledY,
    style,
    ...rest
  } = props;
  const classes = cn(
    S.root,
    size && S[`size-${size}`],
    centered && S.centered,
    vertical && S.vertical,
    scrolledX && S.scrolledX,
    scrolledY && S.scrolledY,
    fullHeight && S.fullHeight,
    fullWidth && S.fullWidth,
    className
  );
  const stylesObj = { ...style };

  return (
    <div className={classes} {...rest} style={stylesObj}>
      {children}
    </div>
  );
}
