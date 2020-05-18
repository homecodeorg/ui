import cn from 'classnames';

import S from './Menu.styl';

export function Menu({
  padded,
  paddedX,
  highlighted,
  className,
  children,
  align = 'left',
}) {
  const classes = cn(
    S.root,
    S[align],
    padded && S.padded,
    paddedX && S.paddedX,
    highlighted && S.highlighted,
    className
  );

  return <ul className={classes}>{children}</ul>;
}

export function MenuItem({ children, selected, As = 'li', ...props }) {
  const classes = cn(
    S.item,
    selected && S.selected,
    props.onClick && S.clickable
  );

  return (
    <As className={classes} {...props}>
      {children}
    </As>
  );
}
