import cn from 'classnames';

import SpinnerIcon from './spinner.svg';
import S from './Spinner.styl';
import * as T from './Spinner.types';

export const Spinner = ({ size = 'm', className = '', ...props }: T.Props) => {
  const classes = cn(S.root, S[`size-${size}`], className);

  return <SpinnerIcon className={classes} {...props} />;
};
