import { ReactNode } from 'react';
import cn from 'classnames';

import { Button, ButtonProps } from '../../Button/Button';

import S from './SubmitButtons.styl';

export type ButtonConfig = ButtonProps & {
  key: string;
  children?: ReactNode;
};

type Props = {
  className?: string;
  buttons: ButtonConfig[];
  children?: ReactNode;
};

export const SubmitButtons = ({ buttons, className, ...props }: Props) => (
  <div className={cn(S.root, className)} {...props}>
    {buttons.map(buttonProps => (
      <Button className={cn(S.item, buttonProps.className)} {...buttonProps} />
    ))}
  </div>
);
