import cn from 'classnames';

import SpinnerIcon from './spinner.svg';
import S from './Spinner.styl';

export const Spinner = ({ size = 's', className = '', ...props }) => {
  const classes = cn(S.root, S[`size-${size}`], className);

  return <SpinnerIcon className={classes} {...props} />;
};
