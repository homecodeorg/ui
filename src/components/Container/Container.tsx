import cn from 'classnames';

import S from './Container.styl';

type Props = {
  className?: string;
  children: any;
  centered?: boolean;
  vertical?: boolean;
  fullHeight?: boolean | string;
  scrolledX?: boolean;
  scrolledY?: boolean;
  style?: Partial<CSSStyleDeclaration>;
};

function getMinHeight(prop): any {
  if (!prop) return null;

  const minHeight = typeof prop === 'string' ? prop : '100vh';
  return { minHeight };
}

export default function SBWrapper(props: Props) {
  const {
    className,
    children,
    centered,
    vertical,
    fullHeight,
    scrolledX,
    scrolledY,
    style,
    ...rest
  } = props;
  const classes = cn(
    S.root,
    centered && S.centered,
    vertical && S.vertical,
    scrolledX && S.scrolledX,
    scrolledY && S.scrolledY,
    className
  );
  const stylesObj = { ...style, ...getMinHeight(fullHeight) };

  return (
    <div className={classes} {...rest} style={stylesObj}>
      {children}
    </div>
  );
}
