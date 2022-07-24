import moment from 'moment';

import * as T from './DateTime.types';

export function formatDate({ value, format, locale = 'en' }) {
  const d = moment(value).locale(locale);

  if (format) {
    if (d[format]) return d[format]();
    return d.format(format);
  }

  return d.toString();
}

export function DateTime({ value = new Date(), format, locale }: T.Props) {
  return <>{formatDate({ value, format, locale })}</>;
}
