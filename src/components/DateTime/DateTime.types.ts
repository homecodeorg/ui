import { ReactNode } from 'react';
import { Moment } from 'moment';

export type Props = {
  value?: Date | Moment | string;
  format?: string;
  locale?: string;
  children?: ReactNode;
};
