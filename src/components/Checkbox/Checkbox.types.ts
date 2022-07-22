import { ReactNode, DOMAttributes } from 'react';

import { Size } from '../../types';

export type Props = DOMAttributes<HTMLInputElement> & {
  id?: string;
  className?: string;
  label?: ReactNode;
  checked?: boolean;
  error?: string | boolean;
  size: Size;
};
