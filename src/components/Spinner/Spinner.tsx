import cn from 'classnames';

import Icon from './spinner.svg';
import S from './Spinner.styl';

export const Spinner = ({ size = 's', className = '', ...props }) => {
  // @ts-ignore
  const classes = cn(S.root, S[`size-${size}`], className);

  return <Icon className={classes} {...props} />;
};
