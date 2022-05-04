import { ReactNode } from 'react';
import moment, { Moment } from 'moment';

type Props = {
  value?: Date | Moment | string;
  format?: string;
  locale?: string;
  children?: ReactNode;
};

export function formatDate({ value, format, locale = 'en' }) {
  const d = moment(value).locale(locale);

  if (format) {
    if (d[format]) return d[format]();
    return d.format(format);
  }

  return d.toString();
}

export function DateTime({ value = new Date(), format, locale }: Props) {
  return <>{formatDate({ value, format, locale })}</>;
}
