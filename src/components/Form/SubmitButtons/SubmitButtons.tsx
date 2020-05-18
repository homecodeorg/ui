// import Icon from 'components/Icon/Icon';
// import { IconType } from 'components/Icon/Icon.types';
import { Button, ButtonProps } from 'components/Button/Button';

import S from './SubmitButtons.styl';

export type ButtonConfig = ButtonProps & {
  key: string;
  // icon?: IconType;
  // children: React.ReactChild;
};

type Props = {
  className?: string;
  buttons: ButtonConfig[];
  children: JSX.Element | JSX.Element[];
};

export type Variant = ButtonProps['variant'];
export const SubmitButtons = ({ buttons, ...props }: Props) => (
  <div className={S.root} {...props}>
    {buttons.map(({ children, ...buttonProps }) => (
      <Button className={S.item} {...buttonProps}>
        {/*icon && <Icon type={icon} size={buttonProps.size} />*/}
        {children}
      </Button>
    ))}
  </div>
);
