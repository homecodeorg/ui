import cn from 'classnames';

import type { IconType } from 'uilib/components/Icon/Icon.types';
import type { ButtonProps } from 'uilib/components/Button/Button';
import type { Size } from 'uilib/types';

import { Button } from 'uilib/components/Button/Button';
import { Icon } from 'uilib/components/Icon/Icon';

import S from './IconButton.styl';

export type IconButtonProps = Omit<
  ButtonProps,
  'variant' | 'square' | 'children'
> & {
  type: IconType;
  className?: string;
  size?: Size;
};

export function IconButton({
  type,
  size,
  className,
  // @ts-ignore
  ...rest
}: IconButtonProps) {
  return (
    <Button
      {...rest}
      className={cn(S.root, className)}
      variant="clear"
      size={size}
    >
      <Icon type={type} size={size} />
    </Button>
  );
}
