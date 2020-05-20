import cn from 'classnames';

import Icon from './spinner.svg';
import S from './Spinner.styl';

const Spinner = ({ size = 's', className, paddedX, ...props }) => {
  const classes = cn(S.root, S[`size-${size}`], className);

  return <Icon className={classes} {...props} />;
};

export default Spinner;
