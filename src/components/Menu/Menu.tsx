import { forwardRef } from 'react';
import cn from 'classnames';
import { Scroll } from 'uilib/components/Scroll/Scroll';

import { MenuGroupProps, MenuItemProps, MenuProps } from './Menu.types';
import S from './Menu.styl';

// @ts-ignore
const MenuComponent = forwardRef<Scroll, MenuProps>(
  ({ children, className, ...props }, ref) => {
    const size = props.size || 'm';

    return (
      <Scroll
        y
        // @ts-ignore
        ref={ref}
        className={cn(S.root, className, S[`size-${size}`])}
        {...props}
      >
        {children}
      </Scroll>
    );
  }
);

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>((props, ref) => {
  const {
    children,
    className,
    selected,
    focused,
    disabled,
    level = 0,
    onClick,
    ...rest
  } = props;

  const classes = cn(
    S.item,
    level > 0 && S[`level-${level}`],
    selected && S.selected,
    focused && S.focused,
    disabled && S.disabled,
    className
  );

  return (
    <div
      ref={ref}
      className={classes}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      <span>{children}</span>
    </div>
  );
});

const MenuGroup: React.FC<MenuGroupProps> = ({
  children,
  className,
  label,
  size = 'm',
  ...props
}) => {
  return (
    <>
      <div
        className={cn(
          S.group,
          className,

          S[`size-${size}`]
        )}
        {...props}
      >
        {label}
      </div>
      {children}
    </>
  );
};

export { type MenuProps };

export const Menu = Object.assign(MenuComponent, {
  Item: MenuItem,
  Group: MenuGroup,
});
